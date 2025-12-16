import styles from "./Field.module.css";

function Field({ title, description="" ,children , titleClassName }) {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.titleContainer}>
        <p className={`${styles.title} ${titleClassName}`}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.fieldChildren}>
        {children}
      </div>
    </div>
  );
}

export default Field;
