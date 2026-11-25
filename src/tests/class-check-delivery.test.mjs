import {beforeEach,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({rpc:vi.fn(),rows:{}}));
vi.mock('@/lib/supabase/server',()=>({createServiceSupabaseClient:()=>({rpc:mocks.rpc,from:table=>{const chain={select:()=>chain,eq:()=>chain,maybeSingle:async()=>({data:mocks.rows[table],error:null}),then:resolve=>resolve({data:mocks.rows[table]??[],error:null})};return chain;}})}));
import {getLearnerCheck} from '@/lib/learning/checks';
beforeEach(()=>{vi.clearAllMocks();mocks.rows={quiz_attempts:{id:'attempt',enrollment_id:null,episode_entitlement_id:'class-purchase',quiz_id:'quiz',status:'in_progress',attempt_number:1,score:null,max_score:null,passed:null,started_at:'2026-11-25T09:00:00Z',question_snapshot:[{id:'q',prompt:'Question',points:1,options:[{id:'a',text:'A',correct:true},{id:'b',text:'B',correct:false}]}],delivery_rules:{passingScore:70},draft_answers:{}},quizzes:{assessment_id:'assessment'},assessments:{title:'Class check',lesson_id:'class',course_id:'course'}};});
it('delivers an individually purchased class check after server access verification',async()=>{
 mocks.rpc.mockResolvedValue({error:null});const result=await getLearnerCheck('attempt','buyer');expect(result?.courseId).toBe('course');expect(result?.lessonId).toBe('class');expect(result?.questions[0].options[0]).not.toHaveProperty('correct');expect(mocks.rpc).toHaveBeenCalledWith('learning_attempt_access',{target_attempt:'attempt',subject:'buyer'});
});
it('does not deliver expired, revoked or another buyer\'s test',async()=>{
 mocks.rpc.mockResolvedValue({error:{message:'Class access required'}});expect(await getLearnerCheck('attempt','other')).toBeNull();
});
