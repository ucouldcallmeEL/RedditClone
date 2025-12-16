import styles from "./PopupTextInput.module.css";

export default function openTextPopup({ title, description, placeholder, maxChars , defaultValue=""}) {
  const popup = document.createElement("div");
  popup.className = styles.overlay;

  popup.innerHTML = `
    <div class="${styles.popup}">
      <h3 class="${styles.title}">${title}</h3>
      <p class="${styles.desc}">${description}</p>

      <textarea
        class="${styles.textarea}"
        placeholder="${placeholder}"
        maxlength="${maxChars}"
      >${defaultValue}</textarea>

      <div class="${styles.buttons}">
        <button id="popup-cancel" class="${styles.cancel}" >Cancel</button>
        <button id="popup-save" class="${styles.save}" >Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const textarea = popup.querySelector("textarea");

  return new Promise((resolve) => {
    document.getElementById("popup-cancel").onclick = () => {
      popup.remove();
      resolve(null);
    };

    document.getElementById("popup-save").onclick = () => {
      const text = textarea.value.trim();
      popup.remove();
      resolve(text);
    };
  });
}
