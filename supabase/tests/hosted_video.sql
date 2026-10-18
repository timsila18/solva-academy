do $test$
declare result jsonb; c uuid; l uuid; u uuid; template uuid; school uuid; level uuid; denied boolean;
begin
 begin
 perform set_config('request.jwt.claim.sub','7161f4bc-8119-4f0f-9448-6dc4f8e5869b',true);
 perform set_config('request.jwt.claim.role','authenticated',true);
 select id into template from public.course_studio_templates where is_active limit 1;
 select id into school from public.schools where status='published' limit 1;
 select id into level from public.course_levels where status='active' limit 1;
 result:=public.studio_command(null,'create',jsonb_build_object('workspaceId','c54f4797-690b-4b3f-b8ac-7256b111edfd','templateId',template,'schoolId',school,'levelId',level,'title','Hosted video rollback test','description','Private temporary video hosting authorization test.','titles',jsonb_build_array('Test class')));
 c:=(result->>'courseId')::uuid;select id into l from public.course_lessons where course_id=c limit 1;
 insert into public.course_video_uploads(course_id,lesson_id,actor_id) values(c,l,auth.uid()) returning id into u;
 denied:=false;begin perform public.studio_attach_hosted_video(u,100,repeat('a',64));exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'An untrusted user attached unverified hosted media'; end if;
 perform set_config('request.jwt.claim.role','service_role',true);
 denied:=false;begin perform public.studio_attach_hosted_video(u,null,null);exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'Null storage verification accepted'; end if;
 denied:=false;begin perform public.studio_attach_hosted_video(u,350000001,repeat('a',64));exception when raise_exception then denied:=true;end;
 if not denied then raise exception 'Oversized video accepted'; end if;
 perform public.studio_attach_hosted_video(u,350000000,repeat('a',64));
 if not exists(select 1 from public.lesson_content_blocks where lesson_id=l and content->>'provider'='hostafrica' and content->>'uploadId'=u::text) then raise exception 'Verified hosted video not attached'; end if;
 if not exists(select 1 from public.course_video_uploads where id=u and status='attached' and bytes=350000000) then raise exception 'Upload receipt not saved'; end if;
 if not exists(select 1 from public.audit_logs where resource_id=c::text and action='studio_hosted_video_attached') then raise exception 'Attachment audit missing'; end if;
 perform set_config('request.jwt.claim.role','authenticated',true);
 update public.course_lessons set learning_objective='Apply the documented lesson' where id=l;
 perform public.studio_command(c,'submit','{}');
 if public.studio_can_edit_course(c) then raise exception 'Hosted-video course did not freeze after submission'; end if;
 raise exception using errcode='Z0001',message='rollback hosted video fixtures';
 exception when sqlstate 'Z0001' then raise notice 'PASS: service-only verification, 350 MB boundary, atomic attachment, readiness, audit and review freeze. Fixtures rolled back.';
 end;
end $test$;
