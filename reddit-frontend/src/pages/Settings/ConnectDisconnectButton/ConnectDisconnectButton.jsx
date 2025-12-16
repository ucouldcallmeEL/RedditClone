import { useState } from "react";
import styles from "./ConnectDisconnectButton.module.css";

function ConnectDisconnectButton({ type = "connect"}) {

	const [btnType , setBtnType] = useState(type);

	function handleBtnChange(){
        if(btnType === "connect"){setBtnType("disconnect")}
        else if(btnType === "disconnect"){setBtnType("connect")}
        else {return}
    }

	return (
		<button
		onClick={() => handleBtnChange()}
		className={`${styles.btn} ${
			btnType === "disconnect" ? styles.disconnect : styles.connect
		}`}
		>
		{btnType === "disconnect" ? "Disconnect" : "Connect"}
		</button>
	);
}
export default ConnectDisconnectButton;
