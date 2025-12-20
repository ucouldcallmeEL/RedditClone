import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

function ToggleSwitch({ isOn, onToggle }) {
  const [internalOn, setInternalOn] = useState(false);

  // Determine if controlled or uncontrolled
  const isControlled = isOn !== undefined;
  const currentOn = isControlled ? isOn : internalOn;

  const handleClick = () => {
    if (isControlled) {
      if (onToggle) onToggle(!currentOn);
    } else {
      setInternalOn(!internalOn);
    }
  };

  return (
    <div
      className={`${styles.toggle} ${currentOn ? styles.on : ""}`}
      onClick={handleClick}
    >
      <div className={styles.thumb}>
        {currentOn && <span className={styles.check}>✔</span>}
      </div>
    </div>
  );
}

export default ToggleSwitch;
