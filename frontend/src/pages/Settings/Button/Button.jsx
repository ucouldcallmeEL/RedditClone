import styles from "./Button.module.css"

function Button({text , onClick}){

    return (
        <button 
            onClick={() => onClick()}
            className={styles.btn}>
            {text}
        </button>
    );

}
export default Button;