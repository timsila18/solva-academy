import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { uploadCompressed, preflightUpload } from '../../scripts/video-compressor/upload.mjs';
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();vi.unstubAllGlobals();});
const endpoint='https://images.solfit.co.ke/academy-media.php';
function ticket(){return {provider:'hostafrica',endpoint,id:'a'.repeat(32),course:'b'.repeat(36),lesson:'c'.repeat(36),actor:'d'.repeat(36),signature:'e'.repeat(64),expires:Math.floor(Date.now()/1000)+3600,maxBytes:350000000};}
it('resumes an already compressed file at the server checkpoint using digest-checked encoded chunks',async()=>{
 vi.stubEnv('ACADEMY_MEDIA_ENDPOINT',endpoint);
 const dir=await mkdtemp(join(tmpdir(),'academy-retry-'));const file=join(dir,'saved.mp4');
 const bytes=Buffer.alloc(2097152+99,23);await writeFile(file,bytes);
 const calls=[];
 vi.stubGlobal('fetch',vi.fn(async(input,options)=>{const q=new URL(input).searchParams;const action=q.get('action');calls.push(action);
  if(action==='offset')return Response.json({next:1});
  if(action==='chunk'){expect(q.get('index')).toBe('1');expect(Buffer.from(options.body,'base64')).toEqual(bytes.subarray(2097152));expect(options.headers['X-Chunk-Encoding']).toBe('base64');return Response.json({ok:true});}
  return Response.json({id:'a'.repeat(32),bytes:bytes.length});
 }));
 try{const job={output:file,outputBytes:bytes.length,controller:new AbortController()};await uploadCompressed(job,ticket());expect(calls).toEqual(['offset','chunk','complete']);expect((await readFile(file)).equals(bytes)).toBe(true);expect(job.uploadProgress).toBe(100);}
 finally{await rm(dir,{recursive:true,force:true});}
});
it('detects rejected authorization before compression begins',async()=>{
 vi.stubEnv('ACADEMY_MEDIA_ENDPOINT',endpoint);vi.stubGlobal('fetch',vi.fn(async()=>new Response(null,{status:401})));
 await expect(preflightUpload(ticket())).rejects.toThrow(/Compression has not started/);
});
it('shows saved video retry without asking for the original file or starting compression',async()=>{
 const html=await readFile('scripts/video-compressor/index.html','utf8');document.body.innerHTML=html;
 const job={id:'saved-id',state:'done',progress:100,sample:false,name:'Class 1.mp4',sourceBytes:5000000000,outputBytes:200000000,uploadState:'failed'};
 vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});
 vi.stubGlobal('fetch',vi.fn(async(url)=>({ok:!url.endsWith('/upload'),json:async()=>url==='/api/jobs'?[job]:url.endsWith('/upload')?{error:'Reconnect from your Academy class.'}:job})));
 const script=/<script nonce="__NONCE__">([\s\S]+)<\/script>/.exec(html)[1];new Function(script)();
 await vi.waitFor(()=>expect(document.querySelector('#saved-list button')?.textContent).toBe('Retry upload only'));
 await vi.waitFor(()=>expect(document.querySelector('#result').hidden).toBe(false));
 await document.querySelector('#saved-list button').onclick();
 expect(fetch.mock.calls.some(([url])=>url==='/api/jobs/saved-id/upload')).toBe(true);
 expect(fetch.mock.calls.some(([url,options])=>url==='/api/jobs'&&options?.method==='POST')).toBe(false);
 expect(document.querySelector('#error').textContent).toContain('still saved');
});
