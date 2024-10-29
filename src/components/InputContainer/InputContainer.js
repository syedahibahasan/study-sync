import styles from "./InputContainer.module.css";

export default function InputContainer({ label, bgColor, children }) {
  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }}>
      <div className={styles.parentcontainer}>
        <label className={styles.label}>{label}</label>
      </div>
      <div className={styles.contect}>{children}</div>
    </div>
  );
}
