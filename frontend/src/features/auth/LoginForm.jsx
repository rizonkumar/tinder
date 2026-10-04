import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../constants/navigation";
import { PasswordInput } from "./PasswordInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login({ email: email.trim(), password });
    if (success) {
      navigate(location.state?.from || ROUTES.swipe, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Email" required>
        {(id) => (
          <Input
            id={id}
            icon={Mail}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        )}
      </Field>

      <Field label="Password" required>
        {(id) => (
          <PasswordInput
            id={id}
            name="password"
            placeholder="Your password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        )}
      </Field>

      <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!email || !password}>
        {loading ? "Signing in" : "Sign in"}
      </Button>

      <p className="copy-13 text-center text-foreground-muted">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
