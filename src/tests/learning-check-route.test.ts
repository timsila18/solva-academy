import {beforeEach,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({getUser:vi.fn(),rpc:vi.fn(),check:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createServerSupabaseClient:async()=>({auth:{getUser:mocks.getUser}}),createServiceSupabaseClient:()=>({rpc:mocks.rpc,from:()=>({select:()=>({eq:()=>({single:async()=>({data:{enrollment_id:null}})})})})})}));
vi.mock('@/lib/learning/checks',()=>({getLearnerCheck:mocks.check}));
import {PUT,POST} from '@/app/api/learning/checks/[attemptId]/route';
const id='00000000-0000-4000-8000-000000000001';
const context={params:Promise.resolve({attemptId:id})};
const request=(body:string,origin?:string)=>new Request(`https://academy.solvaone.co.ke/api/learning/checks/${id}`,{method:'PUT',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body});
beforeEach(()=>{vi.clearAllMocks();mocks.getUser.mockResolvedValue({data:{user:{id:'learner'}}});});
it('requires authentication before accessing any attempt',async()=>{
 mocks.getUser.mockResolvedValue({data:{user:null}});expect((await POST(request('{}'),context)).status).toBe(401);expect(mocks.rpc).not.toHaveBeenCalled();
});
it('rejects cross-origin writes',async()=>{
 expect((await PUT(request('{}','https://other.example'),context)).status).toBe(403);expect(mocks.getUser).not.toHaveBeenCalled();
});
it('rejects malformed JSON without attempting a mutation',async()=>{
 expect((await PUT(request('{'),context)).status).toBe(400);expect(mocks.rpc).not.toHaveBeenCalled();
});
it('does not return any attempt details after a denied server access check',async()=>{
 mocks.rpc.mockResolvedValue({error:{message:'Learning access required'}});
 const r=await PUT(request(JSON.stringify({answers:{}})),context);expect(r.status).toBe(409);expect(mocks.check).not.toHaveBeenCalled();expect(await r.text()).not.toContain('Learning access required');
});
it('binds saved answers to the authenticated user and the requested attempt',async()=>{
 mocks.rpc.mockResolvedValue({error:null});mocks.check.mockResolvedValue({id,status:'in_progress'});
 const r=await PUT(request(JSON.stringify({answers:{[id]:id}})),context);expect(r.status).toBe(200);expect(mocks.rpc).toHaveBeenCalledWith('learning_save_check',{target_attempt:id,subject:'learner',responses:{[id]:id}});expect(r.headers.get('cache-control')).toBe('no-store');
});
it('does not grant full-course completion when a class-only test is submitted',async()=>{
 mocks.rpc.mockResolvedValue({error:null});mocks.check.mockResolvedValue({id,status:'passed'});
 const r=await POST(request(JSON.stringify({answers:{[id]:id}})),context);expect(r.status).toBe(200);
 expect(mocks.rpc).toHaveBeenCalledTimes(1);expect(mocks.rpc).toHaveBeenCalledWith('learning_submit_check',expect.objectContaining({subject:'learner'}));
});
