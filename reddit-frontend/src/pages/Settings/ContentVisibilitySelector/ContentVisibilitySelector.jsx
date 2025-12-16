import { useState } from "react";
import styles from "./ContentVisibilitySelector.module.css";

function ContentVisibilitySelector({ value, onChange }) {
  const [selected, setSelected] = useState(value);

  const options = [
    {
      id: "show",
      icon: "👁️",
      title: "Show all",
      desc: "Show all posts, comments, and communities you’re active in on your profile",
    },
    {
      id: "customize",
      icon: "🛠️",
      title: "Customize",
      desc: "Choose what posts, comments, and communities you’re active in show on your profile",
    },
    {
      id: "hide",
      icon: "🙈",
      title: "Hide all",
      desc: "Hide all posts, comments, and communities you’re active in on your profile",
    },
  ];

  const select = (id) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div className={styles.wrapper}>
      {options.map((opt) => (
        <div
          key={opt.id}
          className={`${styles.item} ${
            selected === opt.id ? styles.selected : ""
          }`}
          onClick={() => select(opt.id)}
        >
          <div className={styles.left}>
            <span className={styles.icon}>{opt.icon}</span>
            <div className={styles.text}>
              <div className={styles.title}>{opt.title}</div>
              <div className={styles.desc}>{opt.desc}</div>
            </div>
          </div>

          <div className={styles.radioOuter}>
            {selected === opt.id && <div className={styles.radioInner} />}
          </div>
        </div>
      ))}
    </div>
  );
}
export default ContentVisibilitySelector;
