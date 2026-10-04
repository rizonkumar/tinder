import { useState } from "react";
import { Mail, User, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { GENDER_OPTIONS, PREFERENCE_OPTIONS } from "../../constants";
import { PasswordInput } from "./PasswordInput";

const INITIAL = { name: "", email: "", password: "", gender: "", age: "", genderPreference: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.password.length < 6) errors.password = "Use at least 6 characters.";
  const age = Number(values.age);
  if (!age || age < 18 || age > 120) errors.age = "You must be 18 or older.";
  if (!values.gender) errors.gender = "Pick one.";
  if (!values.genderPreference) errors.genderPreference = "Pick one.";
  return errors;
}

export default function SignupForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const { signup, loading } = useAuthStore();

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched) setErrors(validate({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched(true);
    if (Object.keys(nextErrors).length > 0) return;
    await signup({ ...values, name: values.name.trim(), email: values.email.trim(), age: Number(values.age) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Full name" required error={errors.name}>
        {(id) => (
          <Input id={id} icon={User} name="name" autoComplete="name" placeholder="Your name" value={values.name} invalid={!!errors.name} onChange={(e) => update("name", e.target.value)} />
        )}
      </Field>

      <Field label="Email" required error={errors.email}>
        {(id) => (
          <Input id={id} icon={Mail} type="email" name="email" autoComplete="email" placeholder="you@example.com" value={values.email} invalid={!!errors.email} onChange={(e) => update("email", e.target.value)} />
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
        <Field label="Password" required error={errors.password} hint={!errors.password ? "At least 6 characters." : undefined}>
          {(id) => (
            <PasswordInput id={id} name="password" autoComplete="new-password" placeholder="Create a password" value={values.password} invalid={!!errors.password} onChange={(e) => update("password", e.target.value)} />
          )}
        </Field>
        <Field label="Age" required error={errors.age}>
          {(id) => (
            <Input id={id} icon={Calendar} type="number" inputMode="numeric" name="age" min="18" max="120" placeholder="18+" value={values.age} invalid={!!errors.age} onChange={(e) => update("age", e.target.value)} />
          )}
        </Field>
      </div>

      <Field label="I am" required error={errors.gender}>
        <SegmentedControl label="Your gender" options={GENDER_OPTIONS} value={values.gender} onChange={(value) => update("gender", value)} />
      </Field>

      <Field label="Interested in" required error={errors.genderPreference}>
        <SegmentedControl label="Who you want to meet" options={PREFERENCE_OPTIONS} value={values.genderPreference} onChange={(value) => update("genderPreference", value)} />
      </Field>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {loading ? "Creating account" : "Create account"}
      </Button>

      <p className="copy-13 text-center text-foreground-muted">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
