import { Field, Input, Select, TextArea } from "@/components/ui/form-fields";
type Choice = { id: string; name: string };
export function StudioDetails({
  schools,
  levels,
  course = {},
  price = 0,
  classPrice = 0,
  sellClasses = false,
}: {
  schools: Choice[];
  levels: Choice[];
  course?: Record<string, string>;
  price?: number;
  classPrice?: number;
  sellClasses?: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Course title">
        <Input
          name="title"
          required
          minLength={3}
          maxLength={200}
          defaultValue={course.title}
        />
      </Field>
      <Field label="Subtitle">
        <Input name="subtitle" maxLength={300} defaultValue={course.subtitle} />
      </Field>
      <Field label="School">
        <Select name="schoolId" required defaultValue={course.school_id ?? ""}>
          <option value="">Choose school</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Level">
        <Select name="levelId" required defaultValue={course.level_id ?? ""}>
          <option value="">Choose level</option>
          {levels.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Description">
        <TextArea
          name="description"
          required
          minLength={20}
          maxLength={5000}
          defaultValue={course.short_description}
        />
      </Field>
      <Field label="Who is this course for?">
        <TextArea name="audience" defaultValue={course.target_learner} />
      </Field>
      <Field label="Prerequisites">
        <TextArea name="prerequisites" defaultValue={course.prerequisites} />
      </Field>
      <Field label="Teaching language">
        <Select name="language" defaultValue={course.language ?? "en"}>
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </Select>
      </Field>
      <Field label="Full course price (KES)">
        <Input
          name="coursePriceKes"
          type="number"
          min={0}
          max={1000000}
          step={1}
          required
          defaultValue={price}
        />
      </Field>
      <Field label="Default class price (KES)">
        <Input
          name="classPriceKes"
          type="number"
          min={0}
          max={1000000}
          step={1}
          required
          defaultValue={classPrice}
        />
      </Field>
      <label className="flex items-center gap-3 text-sm md:col-span-2">
        <input
          name="sellClasses"
          type="checkbox"
          defaultChecked={sellClasses}
        />{" "}
        Sell individual classes as well as the full course
      </label>
    </div>
  );
}
