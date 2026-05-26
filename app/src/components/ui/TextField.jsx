export default function TextField({
  label,
  icon: Icon,
  error,
  inputStyle,
  wrapStyle,
  className = "",
  ...inputProps
}) {
  const inputClass = `field-input ${error ? "field-input--error" : ""} ${className}`.trim();
  const inputPadding = Icon ? undefined : { paddingLeft: 14 };

  return (
    <>
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrap" style={wrapStyle}>
        {Icon && <Icon size={18} className="field-icon" />}
        <input
          className={inputClass}
          style={{ ...inputPadding, ...inputStyle }}
          {...inputProps}
        />
      </div>
    </>
  );
}
