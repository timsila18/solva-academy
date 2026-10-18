do $migration$ begin
update storage.buckets set file_size_limit=350000000 where id='course-media';
-- Change the existing attachment guard without altering its authorization, locking or resource limits.
execute replace(pg_get_functiondef('public.studio_attach_upload(uuid,uuid,text,text,text)'::regprocedure),'then 104857600 else 52428800','then 350000000 else 52428800');
if position('then 350000000 else 52428800' in pg_get_functiondef('public.studio_attach_upload(uuid,uuid,text,text,text)'::regprocedure))=0 then raise exception 'Video attachment limit update failed'; end if;
end $migration$;
