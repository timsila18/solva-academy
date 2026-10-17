-- Owner-requested content setup, not an application migration. Safe to rerun:
-- an existing course is never overwritten, especially after videos are attached.
do $setup$
declare
  owner_user uuid; academy record; school uuid; v_course uuid; v_version uuid;
  v_module uuid; v_lesson uuid; v_product uuid; entry jsonb; n integer := 0;
  curriculum jsonb := $curriculum$[
    {"title":"HR Practice & Employee Lifecycle","summary":"Understand what HR does and how its functions connect throughout employment.","outcomes":"Explain the employee lifecycle, shared people-management responsibilities, and the difference between operational and strategic HR.","exercise":"Map an employee journey from workforce need to exit. Identify HR, manager and employee responsibilities at each stage."},
    {"title":"Human Resource Planning","summary":"Identify workforce needs, available capacity, gaps and practical responses before recruiting.","outcomes":"Explain workforce demand and supply, establishment, vacancies, forecasting, budgets and succession risks.","exercise":"Use an establishment scenario to identify gaps, priorities, timing and alternatives before recommending recruitment."},
    {"title":"Job Analysis & Job Evaluation","summary":"Define jobs, person requirements, reporting relationships and relative job value.","outcomes":"Distinguish job analysis, descriptions, specifications, competencies, evaluation and grading.","exercise":"Choose one position. Draft its purpose, duties and person requirements, then identify factors relevant to its relative job value."},
    {"title":"Recruitment & Selection","summary":"Plan a consistent recruitment and selection process based on approved requirements and evidence.","outcomes":"Confirm approval and budget, develop shortlisting criteria, and connect assessment and interviews to appointment.","exercise":"For one approved role, outline the recruitment journey and create consistent shortlisting criteria."},
    {"title":"Onboarding, Probation & Confirmation","summary":"Prepare for a new employee and support a structured start, probation and confirmation.","outcomes":"Distinguish orientation from onboarding, plan first-day essentials, and manage probation expectations, feedback and records.","exercise":"Prepare a first-day checklist and a probation review plan for Amina, the fictional training employee."},
    {"title":"Personnel Records & HR Registry","summary":"Organize accurate, secure and traceable personnel records.","outcomes":"Explain employment evidence, organize personnel files, and assign access by legitimate responsibility.","exercise":"Create a personnel-file index and assign access by legitimate responsibility."},
    {"title":"Leave, Attendance & Employee Movements","summary":"Administer employee time and movements with clear approvals and effective dates.","outcomes":"Trace leave requests, explain working schedules, and identify movement records and possible payroll impacts.","exercise":"Trace a leave request and document a department movement, including effective date and payroll impact where applicable."},
    {"title":"Performance Management","summary":"Connect organizational goals to clear objectives, feedback and improvement.","outcomes":"Develop SMART objectives, explain monitoring and review, and distinguish performance problems from misconduct.","exercise":"Rewrite a vague objective as a SMART objective and outline a supporting improvement plan."},
    {"title":"Training, Learning & Development","summary":"Identify genuine capability gaps and select relevant development approaches.","outcomes":"Identify training needs, choose methods beyond classroom training, and evaluate learning and workplace behaviour.","exercise":"Identify a capability gap, choose a development method and explain how you will evaluate the result."},
    {"title":"Payroll & Salary Administration","summary":"Understand payroll inputs, processing, checking, approval and reconciliation.","outcomes":"Trace the payroll cycle, explain gross and net pay, and apply maker-checker controls and exception review.","exercise":"Build a payroll checklist covering inputs, checking, approval, exceptions and reconciliation."},
    {"title":"Compensation, Benefits & Welfare","summary":"Examine total reward, pay structures, employee benefits and wellbeing.","outcomes":"Assess reward equity, competitiveness and affordability, and explain salary progression and employee welfare.","exercise":"Review a fictional reward package against equity, competitiveness, affordability, performance and compliance."},
    {"title":"Discipline, Grievances & Employee Relations","summary":"Approach workplace concerns with fair procedure, evidence and communication.","outcomes":"Explain discipline, procedural fairness, consistent decisions, grievance resolution and workplace trust.","exercise":"Outline a fair response to an allegation and a structured way to hear a grievance."},
    {"title":"Employment Law, Safety & HR Compliance","summary":"Identify the legal, safety and information-protection considerations influencing HR practice.","outcomes":"Identify relevant frameworks, contract matters, lifecycle compliance checks, safety responsibilities and data-access principles.","exercise":"Prepare an HR compliance checklist and identify who should access sensitive employee information."},
    {"title":"HRIS, HR Data & People Analytics","summary":"Connect HR information systems, data quality and management decisions.","outcomes":"Explain HRIS and employee self service, identify data-quality requirements, and interpret HR metrics.","exercise":"Select an HR metric. Explain its formula, interpretation and one possible management decision."},
    {"title":"Employee Separation & Exit Management","summary":"Coordinate employee exits, handovers, clearance, access changes and final records.","outcomes":"Identify forms of separation, verify final-dues inputs, and use exit information and knowledge transfer.","exercise":"Prepare an exit checklist covering handover, clearance, property, access, final dues and records."},
    {"title":"Strategic Human Resource Management","summary":"Connect people decisions to business direction and bring the employee lifecycle together.","outcomes":"Connect business and people strategy, identify succession and culture priorities, and turn HR reporting into recommendations.","exercise":"Final capstone: You are the new HR manager in a growing organization with 150 employees and five departments. Address high turnover, manual payroll, poor personnel records, weak performance management, grievances, uncontrolled leave, unstructured training and succession risks. Prepare a workforce assessment, HR priorities, recruitment plan, records improvement plan, performance framework, training plan, payroll controls, reward recommendations, employee-relations interventions, HRIS priorities, compliance checklist, succession plan, management dashboard and a twelve-month HR action plan."}
  ]$curriculum$::jsonb;
begin
  perform pg_advisory_xact_lock(hashtext('solva-hr-masterclass-setup'));
  select user_id into owner_user from public.platform_founder;
  select * into academy from public.academies where slug='solva-hr-academy' and owner_id=owner_user;
  if academy.id is null then raise exception 'The approved Solva HR Academy was not found for the founding owner.'; end if;
  if exists(select 1 from public.courses where slug='hr-practice-from-a-to-z') then
    if not exists(select 1 from public.courses where slug='hr-practice-from-a-to-z' and owner_id=owner_user and academy_id=academy.id) then
      raise exception 'Course address belongs to another owner or academy.';
    end if;
    return;
  end if;
  select school_id into school from public.academy_applications where slug='solva-hr-academy' and status='approved' limit 1;
  if school is null then raise exception 'Approved academy school is missing.'; end if;
  insert into public.courses(owning_workspace_id,owner_id,academy_id,title,slug,subtitle,short_description,full_description,school_id,course_type_id,level_id,language,target_learner,prerequisites,delivery_format,status,visibility,enrollment_status,certificate_available,seo_title,seo_description)
  values(academy.workspace_id,owner_user,academy.id,'HR Practice from A to Z','hr-practice-from-a-to-z','A 16-Part Practical HR Masterclass',
    'Learn how HR works across the employee lifecycle, from workforce planning and recruitment to payroll administration, employee relations, HR systems and strategic people management.',
    'A structured practical programme from Solva HR Academy. Sixteen classes connect HR concepts to workplace processes, documents, risks and HR information systems. Follow Amina, a fictional training employee, through the employee lifecycle, complete practical exercises and bring the learning together in a final HR-manager capstone. Designed for beginners and developing practitioners. Recordings and their durations are pending. This programme does not claim an accredited qualification or professional licence.',
    school,(select id from public.course_types where slug='masterclass' and status='active'),
    (select id from public.course_levels where slug='beginner' and status='active'),'en',
    'Aspiring and practising HR professionals, HR students and graduates, HR and administration officers, supervisors, managers and business owners.',
    'No prior HR qualification required. A device with internet access and a way to complete written exercises are recommended.',
    'self_paced','draft','private','closed',false,'HR Practice from A to Z | Solva HR Academy',
    'A 16-part practical HR masterclass covering the employee lifecycle, workplace processes, HR systems and people strategy.') returning id into v_course;
  insert into public.course_versions(course_id,version_number,status,created_by,change_summary)
    values(v_course,1,'draft',owner_user,'Initial curriculum prepared from the supplied 448-slide presentation; videos pending.') returning id into v_version;
  insert into public.course_team_members(course_id,user_id,role_label,role_slug)
    values(v_course,owner_user,'Course Owner','course-owner');
  insert into public.products(product_type,name,description,status)
    values('course','HR Practice from A to Z - Complete Programme','All 16 classes. Course remains private and unpublished.','active') returning id into v_product;
  insert into public.course_products(course_id,product_id) values(v_course,v_product);
  insert into public.product_prices(product_id,currency,amount_minor,status,enrollment_available)
    values(v_product,'KES',1600000,'active',true);
  for entry in select value from jsonb_array_elements(curriculum) loop
    n := n+1;
    insert into public.course_modules(course_id,version_id,title,description,learning_objectives,display_order,required,status,visibility)
      values(v_course,v_version,'Class ' || lpad(n::text,2,'0') || ': ' || (entry->>'title'),entry->>'summary',entry->>'outcomes',n,true,'draft','private') returning id into v_module;
    insert into public.course_lessons(course_id,module_id,version_id,title,slug,lesson_type,short_summary,learning_objective,display_order,required,preview_available,learner_instructions,status)
      values(v_course,v_module,v_version,entry->>'title','class-' || lpad(n::text,2,'0'),'video',entry->>'summary',entry->>'outcomes',n,true,false,entry->>'exercise','draft') returning id into v_lesson;
    insert into public.course_learning_outcomes(course_id,statement,display_order) values(v_course,entry->>'outcomes',n);
    insert into public.products(product_type,name,description,status)
      values('course','HR Practice from A to Z - Class ' || lpad(n::text,2,'0') || ': ' || (entry->>'title'),entry->>'summary','active') returning id into v_product;
    insert into public.episode_products(product_id,course_id,lesson_id,version_id) values(v_product,v_course,v_lesson,v_version);
    insert into public.product_prices(product_id,currency,amount_minor,status,enrollment_available) values(v_product,'KES',100000,'active',true);
  end loop;
  insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,new_data,reason,success)
    values(owner_user,'course_draft_prepared','course',v_course::text,academy.workspace_id,
      jsonb_build_object('classes',16,'course_price_kes',16000,'class_price_kes',1000,'status','draft'),
      'Owner requested a video-ready draft based on their supplied presentation.',true);
end $setup$;
