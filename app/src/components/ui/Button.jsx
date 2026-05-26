export default function Button({
  variant = "primary",
  type = "button",
  children,
  className = "",
  ...rest
}) {
  const variantClass = variant === "ghost" ? "btn-ghost" : "btn-primary";
  return (
    <button type={type} className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
