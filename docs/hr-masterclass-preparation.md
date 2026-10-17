# HR Practice from A to Z

Prepared at the owner's request from the supplied PowerPoint on 18 October 2026.

- Academy: Solva HR Academy.
- Course: HR Practice from A to Z.
- Subtitle: A 16-Part Practical HR Masterclass.
- Owner: the academy's existing founding owner, without changing login or roles.
- Draft course ID: `37fc22f0-b065-4e13-bdd5-02852c3f950b`.
- Editor: `/courses/builder/37fc22f0-b065-4e13-bdd5-02852c3f950b`.
- 16 ordered modules, each containing one video lesson with outcomes and an exercise.
- Class 16 includes the final HR-manager capstone from the presentation.
- 16 individual class products at KSh 1,000; full-course product at KSh 16,000.
- Course remains draft/private with enrollment closed and no published version.
- No fabricated recordings, durations, transcripts, reviews, or accreditation claims.
- Certificate availability is disabled pending the owner's completion-policy decision.

## Presentation

The actual 448-slide PPTX is attached in the private `course-resources` bucket.
Its content hash and byte length are recorded in resource metadata. The owner can
download it from Course materials in the editor through a time-limited URL.
This does not publish the presentation or grant the public access.

## Video Preparation

The editor prioritizes an ordered class checklist. Expand a class to attach its
video and inspect its prepared outcomes and exercise. It displays the actual
attached-video count. Existing curriculum and price forms remain under the
collapsed Course settings & curriculum section.

Current upload support is MP4 up to 100 MB per file. No final videos were supplied,
so actual recording uploads and playback were not tested in this setup. Larger
recordings need a separate upload/storage change before they can be attached.

Publication review, video quality checks, legally sensitive content review, live
merchant credentials and a real checkout test remain launch tasks. Saving prices
does not activate M-Pesa or card processing. Nothing here auto-publishes the course.

## Setup and Tests

`scripts/prepare-hr-masterclass.sql` creates the curriculum, prices and audit event
atomically. Rerunning it leaves an existing matching course unchanged.
`scripts/attach-hr-masterclass-slides.mjs` attaches the supplied file idempotently
using a content-hash path. Neither script is an application migration or public RPC.

`supabase/tests/hr_masterclass_draft.sql` verifies ownership, private draft state,
16 modules/classes, outcomes, pricing, presentation metadata and owner membership.
Component tests verify pending/attached counts and class-price display.
