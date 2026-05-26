export default function Toggle({ checked, onChange, ...rest }) {
  return (
    <label className="settings-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className="settings-toggle-track" />
    </label>
  );
}
