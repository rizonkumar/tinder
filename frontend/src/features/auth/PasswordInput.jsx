import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "../../components/ui/Field";
import { IconButton } from "../../components/ui/IconButton";

export function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      icon={Lock}
      type={visible ? "text" : "password"}
      autoComplete={props.autoComplete || "current-password"}
      trailing={
        <IconButton
          size="sm"
          label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((value) => !value)}
          tabIndex={-1}
        >
          {visible ? <EyeOff /> : <Eye />}
        </IconButton>
      }
      {...props}
    />
  );
}
