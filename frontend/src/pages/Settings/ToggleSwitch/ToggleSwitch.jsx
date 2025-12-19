import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

function ToggleSwitch() {
  const [on, setOn] = useState(false);

  return (
    <div 
      className={`${styles.toggle} ${on ? styles.on : ""}`}
      onClick={() => setOn(!on)}
    >
      <div className={styles.thumb}>
        {on && <span className={styles.check}>✔</span>}
      </div>
    </div>
  );
}

export default ToggleSwitch;
