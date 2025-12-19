import { useState } from "react";
import ContentVisibilitySelector from "../ContentVisibilitySelector/ContentVisibilitySelector";
import styles from "./ContentVisibilityBlock.module.css";

export default function ContentVisibilityBlock() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("show");

  const labels = {
    show: "Show all",
    customize: "Customize",
    hide: "Hide all",
  };

  return (
    <div className={styles.section}>
      {/* Header / Toggle */}
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <div className={styles.textContainer}>
          <span className={styles.headerTitle}>Content and activity</span>
          <span className={styles.description}>Posts, comments, and communities you’re active in</span>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.showAll}>
            {labels[value]}
          </span>

          <span className={`${styles.arrow} ${open ? styles.open : ""}`}>
            ▾
          </span>
        </div>
      </div>

      {/* Collapsible content */}
      <div className={`${styles.collapse} ${open ? styles.open : ""}`}>
        <ContentVisibilitySelector
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
}
