import {expect,it} from 'vitest';
import {evaluateLaunchReadiness} from '@/lib/courses/launch-readiness';
const course={id:'course',title:'Practical HR',short_description:'A detailed introduction to practical HR.',school_id:'school',level_id:'level',language:'en',status:'draft',visibility:'private',certificate_available:false};
const lesson={id:'class-1',title:'Introduction',lesson_type:'video',videoAttached:true,learning_objective:'Apply the core concepts.',learner_instructions:'Work through a case.',estimated_duration_minutes:15};
const base={course,classes:[lesson],priced:true,paid:false,payments:false,checks:[{lessonId:'class-1',valid:true,required:true}],resources:['class-1'],certificateConfigured:false,settingsHref:'/support'};
it('separates readiness for review from actual publication',()=>{
 const result=evaluateLaunchReadiness(base);expect(result.readyForReview).toBe(true);expect(result.readyForLaunch).toBe(false);expect(result.items.find(i=>i.id==='publication')?.status).toBe('waiting');
 expect(evaluateLaunchReadiness({...base,course:{...course,status:'published',visibility:'public'}}).readyForLaunch).toBe(true);
});
it('links missing recordings and learning outcomes to the correct class',()=>{
 const result=evaluateLaunchReadiness({...base,classes:[{...lesson,videoAttached:false,learning_objective:''}]});
 expect(result.readyForReview).toBe(false);expect(result.items.find(i=>i.id==='videos')).toMatchObject({status:'needed',href:'/courses/builder/course/classes/class-1'});expect(result.items.find(i=>i.id==='outcomes')?.status).toBe('needed');
});
it('does not mistake absent prices for a free course and requires payments only for paid prices',()=>{
 expect(evaluateLaunchReadiness({...base,priced:false}).items.find(i=>i.id==='pricing')?.status).toBe('needed');
 expect(evaluateLaunchReadiness({...base,paid:true}).items.find(i=>i.id==='payments')?.status).toBe('needed');
 expect(evaluateLaunchReadiness(base).items.find(i=>i.id==='payments')?.status).toBe('ready');
});
it('keeps optional resources separate from required completion settings',()=>{
 expect(evaluateLaunchReadiness({...base,resources:[]}).readyForReview).toBe(true);
 const result=evaluateLaunchReadiness({...base,course:{...course,certificate_available:true}});expect(result.readyForReview).toBe(false);expect(result.items.find(i=>i.id==='certificate')?.status).toBe('needed');
});
it('requires a complete outline and flags invalid checks without inventing results',()=>{
 expect(evaluateLaunchReadiness({...base,classes:[]}).readyForReview).toBe(false);
 const result=evaluateLaunchReadiness({...base,checks:[{lessonId:'class-1',valid:false,required:false}]});expect(result.items.find(i=>i.id==='checks')).toMatchObject({status:'needed',group:'review'});
});
