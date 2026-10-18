<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://academy.solvaone.co.ke', 'http://127.0.0.1:3002', 'http://localhost:3002'], true)) {
    header('Access-Control-Allow-Origin: '.$origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, GET, HEAD, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Chunk-Digest, X-Chunk-Encoding, Range');
    header('Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
function reject(int $code, string $message = 'Video request rejected'): never {
    http_response_code($code); header('Content-Type: application/json'); echo json_encode(['error'=>$message]); exit;
}
function reply(array $value): never { header('Content-Type: application/json'); echo json_encode($value); exit; }
const MAX_BYTES = 350000000;
const CHUNK_BYTES = 2097152;
$base = dirname(__DIR__);
$configPath = $base.'/academy-media-config.php';
if (!is_file($configPath)) reject(503, 'Academy storage is not configured');
$config = require $configPath;
$secret = $config['secret'] ?? '';
if (!is_string($secret) || !preg_match('/\A[a-f0-9]{64}\z/', $secret)) reject(503);
$key = hash_hmac('sha256', 'academy-video-v1', $secret);
$media = $base.'/academy-video-media'; $staging = $base.'/academy-video-staging';
umask(0077);
foreach ([$media, $staging] as $directory) if (!is_dir($directory) && !mkdir($directory, 0700)) reject(507);
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? ''; $expires = filter_var($_GET['expires'] ?? '', FILTER_VALIDATE_INT); $signature = $_GET['signature'] ?? '';
if (!preg_match('/\A[a-f0-9]{32}\z/', $id) || !$expires || $expires < time() || $expires > time()+15000) reject(401);
if (in_array($action, ['stream','status','purge'], true)) {
    $expected = hash_hmac('sha256', "academy-{$action}-v1\n{$id}\n{$expires}", $key);
    if (!hash_equals($expected, $signature)) reject(401);
    $descriptor = $media.'/'.$id.'.json'; $path = $media.'/'.$id.'.mp4';
    if (!is_file($descriptor) || !is_file($path)) reject(404, 'Video is not ready');
    if ($action === 'purge') {
        if (($_SERVER['REQUEST_METHOD']??'')!=='POST') reject(405);
        if (!unlink($path) || !unlink($descriptor)) reject(503);
        reply(['ok'=>true]);
    }
    $info = json_decode((string)file_get_contents($descriptor), true);
    if ($action === 'status') reply($info);
    $size = filesize($path); $start = 0; $end = $size-1; $range = $_SERVER['HTTP_RANGE'] ?? '';
    if ($range !== '') {
        if (!preg_match('/\Abytes=(\d*)-(\d*)\z/', $range, $m) || ($m[1]==='' && $m[2]==='')) { header("Content-Range: bytes */{$size}"); reject(416); }
        if ($m[1]==='') $start=max(0,$size-(int)$m[2]); else $start=(int)$m[1];
        if ($m[1]!=='' && $m[2]!=='') $end=min((int)$m[2],$end);
        if ($start>$end || $start>=$size) { header("Content-Range: bytes */{$size}"); reject(416); }
        http_response_code(206); header("Content-Range: bytes {$start}-{$end}/{$size}");
    }
    header('Content-Type: video/mp4'); header('Accept-Ranges: bytes'); header('Content-Length: '.($end-$start+1));
    header('Content-Disposition: inline');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'HEAD') exit;
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') reject(405);
    $fp=fopen($path,'rb'); if (!$fp) reject(503); fseek($fp,$start); $left=$end-$start+1;
    while ($left>0 && !feof($fp) && !connection_aborted()) { $data=fread($fp,min(1048576,$left)); if ($data===false || $data==='') break; echo $data; $left-=strlen($data); flush(); }
    fclose($fp); exit;
}
if (!in_array($action,['chunk','complete','offset'],true) || ($_SERVER['REQUEST_METHOD'] ?? '')!=='POST') reject(405);
$course=$_GET['course']??''; $lesson=$_GET['lesson']??''; $actor=$_GET['actor']??'';
foreach ([$course,$lesson,$actor] as $uuid) if (!preg_match('/\A[a-f0-9-]{36}\z/', $uuid)) reject(401);
$expected=hash_hmac('sha256',"academy-upload-v1\n{$id}\n{$course}\n{$lesson}\n{$actor}\n{$expires}\n".MAX_BYTES,$key);
if (!hash_equals($expected,$signature)) reject(401);
$dir=$staging.'/'.$id;
if (!is_dir($dir)) {
    foreach (glob($staging.'/*',GLOB_ONLYDIR)?:[] as $old) {
        if (!preg_match('/\A[a-f0-9]{32}\z/',basename($old))) continue;
        $expiryFile=$old.'/.expires';
        if (is_file($expiryFile) && (int)file_get_contents($expiryFile)<time()-3600) {
            foreach (glob($old.'/*.part')?:[] as $part) @unlink($part);
            @unlink($old.'/.lock'); @unlink($expiryFile); @rmdir($old);
        }
    }
    if (!mkdir($dir,0700)) reject(507);
    file_put_contents($dir.'/.expires',(string)$expires,LOCK_EX);
}
$lock=fopen($dir.'/.lock','c'); if (!$lock || !flock($lock,LOCK_EX)) reject(503);
if (is_file($media.'/'.$id.'.json')) reply(json_decode((string)file_get_contents($media.'/'.$id.'.json'),true));
if ($action==='offset') {
    $next=0;while($next<ceil(MAX_BYTES/CHUNK_BYTES)){$part=$dir.'/'.str_pad((string)$next,4,'0',STR_PAD_LEFT).'.part';if(!is_file($part)||filesize($part)!==CHUNK_BYTES)break;$next++;}
    reply(['next'=>$next]);
}
if ($action==='chunk') {
    $index=filter_var($_GET['index']??'',FILTER_VALIDATE_INT);
    if ($index===false || $index<0 || $index>=ceil(MAX_BYTES/CHUNK_BYTES)) reject(400);
    $encoded=($_SERVER['HTTP_X_CHUNK_ENCODING']??'')==='base64';
    $bodyLimit=$encoded ? 4*intval(ceil(CHUNK_BYTES/3)) : CHUNK_BYTES;
    if ((int)($_SERVER['CONTENT_LENGTH']??0)>$bodyLimit) reject(413);
    $bytes=file_get_contents('php://input',false,null,0,$bodyLimit+1);
    if ($bytes===false || strlen($bytes)>$bodyLimit) reject(413);
    if ($encoded) $bytes=base64_decode($bytes,true);
    if ($bytes===false || strlen($bytes)<1 || strlen($bytes)>CHUNK_BYTES) reject(413);
    $digest=$_SERVER['HTTP_X_CHUNK_DIGEST']??'';
    if (!preg_match('/\A[a-f0-9]{64}\z/',$digest) || !hash_equals($digest,hash('sha256',$bytes))) reject(422);
    $path=$dir.'/'.str_pad((string)$index,4,'0',STR_PAD_LEFT).'.part';
    $used=0; foreach (glob($dir.'/*.part')?:[] as $part) if ($part!==$path) $used+=filesize($part);
    if ($used+strlen($bytes)>MAX_BYTES) reject(413,'Compressed video exceeds 350 MB');
    if (disk_free_space($dir)<strlen($bytes)+10485760) reject(507,'Hosting storage is full');
    if (file_put_contents($path,$bytes,LOCK_EX)!==strlen($bytes)) reject(507);
    chmod($path,0600); reply(['ok'=>true,'index'=>$index]);
}
$size=filter_var($_GET['size']??'',FILTER_VALIDATE_INT);
$total=filter_var($_GET['total']??'',FILTER_VALIDATE_INT);
if (!$size || $size>MAX_BYTES || !$total || $total!==intval(ceil($size/CHUNK_BYTES))) reject(400);
if (disk_free_space($media)<$size+10485760) reject(507,'Hosting storage is full');
for ($i=0;$i<$total;$i++) {
    $part=$dir.'/'.str_pad((string)$i,4,'0',STR_PAD_LEFT).'.part';
    $expectedSize=min(CHUNK_BYTES,$size-$i*CHUNK_BYTES);
    if (!is_file($part) || filesize($part)!==$expectedSize) reject(409,'Upload is incomplete');
}
$tmp=$media.'/'.$id.'.assembling'; $out=fopen($tmp,'wb'); if (!$out) reject(507);
$hash=hash_init('sha256'); $written=0;
for ($i=0;$i<$total;$i++) {
    $in=fopen($dir.'/'.str_pad((string)$i,4,'0',STR_PAD_LEFT).'.part','rb');
    while (!feof($in)) { $data=fread($in,1048576); if ($data===false || $data==='') break; if (fwrite($out,$data)!==strlen($data)) { fclose($out); unlink($tmp); reject(507); } hash_update($hash,$data); $written+=strlen($data); }
    fclose($in);
}
fclose($out);
$type=(new finfo(FILEINFO_MIME_TYPE))->file($tmp);
$first=file_get_contents($tmp,false,null,0,12);
if ($written!==$size || $type!=='video/mp4' || substr($first,4,4)!=='ftyp') { unlink($tmp); reject(422,'A valid compressed MP4 is required'); }
$info=['id'=>$id,'course'=>$course,'lesson'=>$lesson,'actor'=>$actor,'bytes'=>$written,'sha256'=>hash_final($hash)];
if (!rename($tmp,$media.'/'.$id.'.mp4')) reject(507);
if (file_put_contents($media.'/'.$id.'.json',json_encode($info),LOCK_EX)===false) reject(507);
foreach (glob($dir.'/*.part')?:[] as $part) unlink($part);
flock($lock,LOCK_UN); fclose($lock); @unlink($dir.'/.lock'); @unlink($dir.'/.expires'); @rmdir($dir);
reply($info);
