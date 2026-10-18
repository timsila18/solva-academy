import {afterEach,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
const mocks=vi.hoisted(()=>({refresh:vi.fn()}));
vi.mock("next/navigation",()=>({useRouter:()=>({refresh:mocks.refresh})}));
vi.mock("tus-js-client",()=>({Upload:vi.fn()}));
import {VideoUpload} from "@/components/courses/video-upload";
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.clearAllMocks();});
it("recovers and attaches an earlier completed private upload after reopening the class",async()=>{
 const calls:{url:string;options?:RequestInit}[]=[];
 vi.stubGlobal("fetch",vi.fn(async(url:string,options?:RequestInit)=>{calls.push({url,options});return Response.json(options?.method==="PUT"?{ok:true}:{ready:true});}));
 render(<VideoUpload courseId="course" lessonId="lesson" pendingUploadId="upload"/>);
 await screen.findByText("Video saved to this class.");
 const attached=calls.find(c=>c.options?.method==="PUT");expect(JSON.parse(String(attached?.options?.body))).toEqual({courseId:"course",lessonId:"lesson",path:"hostafrica:upload"});
 expect(mocks.refresh).toHaveBeenCalled();
});
it("stops checking and shows a useful error when account access expires",async()=>{
 vi.stubGlobal("fetch",vi.fn(async()=>Response.json({error:"Sign in again to attach the video."},{status:401})));
 render(<VideoUpload courseId="course" lessonId="lesson" pendingUploadId="upload"/>);
 await screen.findByText("Sign in again to attach the video.");
 await waitFor(()=>expect(screen.getByRole("button",{name:"Compress original"})).toBeEnabled());
 expect(mocks.refresh).not.toHaveBeenCalled();
});
