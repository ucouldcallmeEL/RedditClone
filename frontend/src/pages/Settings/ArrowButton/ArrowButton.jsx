import { FiChevronRight } from "react-icons/fi";
import styles from "./ArrowButton.module.css";

function ArrowButton({ onClick }) {
  return (
    <button className={styles.arrowBtn} onClick={onClick}>
      <FiChevronRight size={18} />
    </button>
  );
}

export default ArrowButton;