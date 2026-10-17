import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, mkdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import ffmpeg from "ffmpeg-static";
import { encodingArguments, probeVideo } from "./engine.mjs";

const folder=resolve(".local/compressor-smoke");
await mkdir(folder,{recursive:true});
const source=join(folder,"test-video.avi");
const generated=spawnSync(ffmpeg,["-hide_banner","-loglevel","error","-y","-f","lavfi","-i","testsrc2=size=1280x720:rate=25","-f","lavfi","-i","sine=frequency=440:sample_rate=44100","-t","6","-c:v","mpeg4","-q:v","1","-c:a","pcm_s16le",source],{encoding:"utf8",windowsHide:true});
assert.equal(generated.status,0,generated.stderr);
assert.throws(()=>encodingArguments("input","output","invalid",false));
const bytes=await readFile(source);
const originalHash=createHash("sha256").update(bytes).digest("hex");
const port=4321;
const base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,["scripts/video-compressor/server.mjs"],{env:{...process.env,VIDEO_COMPRESSOR_PORT:String(port)},windowsHide:true,stdio:["ignore","pipe","pipe"]});
let output="";child.stdout.on("data",b=>{output+=b;});child.stderr.on("data",b=>{output+=b;});
const files=[];
try{
  let html;
  for(let i=0;i<50;i++){try{const r=await fetch(base);html=await r.text();break;}catch{await new Promise(r=>setTimeout(r,200));}}
  assert.ok(html,output);
  const key=/const key="([a-f0-9]{64})"/.exec(html)?.[1];assert.ok(key);
  const headers={"x-compressor-key":key,origin:base};
  assert.equal((await fetch(base+"/api/jobs")).status,403);
  assert.equal((await fetch(base+"/api/jobs?profile=balanced",{method:"POST",headers:{...headers,origin:"https://attacker.example"},body:"x"})).status,403);
  assert.equal((await fetch(base+"/api/jobs?profile=unknown",{method:"POST",headers,body:"x"})).status,400);
  async function create(profile){const r=await fetch(base+`/api/jobs?profile=${profile}&name=Source.avi&sample=true`,{method:"POST",headers,body:bytes});assert.equal(r.status,202);return r.json();}
  async function poll(id){for(let i=0;i<150;i++){const job=await(await fetch(base+"/api/jobs/"+id,{headers})).json();if(["done","failed","cancelled"].includes(job.state))return job;await new Promise(r=>setTimeout(r,200));}throw new Error("Compression timed out");}
  const first=await create("balanced");
  const finished=await poll(first.id);assert.equal(finished.state,"done",finished.error);files.push(finished.outputPath);
  assert.ok(finished.outputBytes<bytes.length,"Encoded fixture should be smaller than the source");
  const info=await probeVideo(finished.outputPath);assert.equal(info.codec,"h264");assert.ok(Math.abs(info.duration-6)<.3);
  const range=await fetch(base+`/api/jobs/${first.id}/file?key=${key}`,{headers:{Range:"bytes=0-99"}});
  assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
  const badRange=await fetch(base+`/api/jobs/${first.id}/file?key=${key}`,{headers:{Range:"bytes=99999999999-"}});assert.equal(badRange.status,416);
  const cancelled=await create("quality");
  await fetch(base+"/api/jobs/"+cancelled.id,{method:"DELETE",headers});
  const stopped=await poll(cancelled.id);assert.equal(stopped.state,"cancelled");
  const invalid=await fetch(base+"/api/jobs?profile=balanced&name=bad.mp4",{method:"POST",headers,body:"This is not a video"});
  const invalidJob=await invalid.json();assert.equal((await poll(invalidJob.id)).state,"failed");
  assert.equal(createHash("sha256").update(await readFile(source)).digest("hex"),originalHash,"Original changed");
  console.log(JSON.stringify({passed:true,sourceBytes:bytes.length,compressedBytes:finished.outputBytes,durationSeconds:info.duration,checks:["real FFmpeg compression","H.264 playback metadata","original preserved","range streaming","cancellation","invalid video","token access","origin rejection"]}));
}finally{
  child.kill();
  await new Promise(r=>child.once("close",r));
  for(const file of files){assert.ok(file.startsWith(resolve("../compressed-videos")+"\\"));await rm(file,{force:true});}
  assert.ok(folder===resolve(".local/compressor-smoke"));
  await rm(folder,{recursive:true,force:true});
}
