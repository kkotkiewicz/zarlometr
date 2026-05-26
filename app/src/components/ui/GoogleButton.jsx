import { IconGoogle } from "../icons";

export default function GoogleButton({ children = "Kontynuuj z Google", ...rest }) {
  return (
    <button type="button" className="btn-google" {...rest}>
      <IconGoogle />
      {children}
    </button>
  );
}
