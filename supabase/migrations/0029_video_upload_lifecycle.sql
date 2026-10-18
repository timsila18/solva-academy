do $migration$ begin
alter table public.course_video_uploads drop constraint course_video_uploads_status_check;
alter table public.course_video_uploads add constraint course_video_uploads_status_check check(status in ('pending','attached','cancelled'));
execute replace(pg_get_functiondef('public.studio_attach_hosted_video(uuid,bigint,text)'::regprocedure),
 'if ticket.expires_at<now() or verified_bytes not between 1 and 350000000 or verified_sha256 !~',
 'if ticket.status<>''pending'' or verified_bytes is null or verified_sha256 is null or ticket.expires_at<now() or verified_bytes not between 1 and 350000000 or verified_sha256 !~');
end $migration$;
