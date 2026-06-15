import styles from './Toggle.module.css';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}

export function Toggle({ checked, onChange, label, id }: Props) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.toggle} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.knob} />
    </button>
  );
}
