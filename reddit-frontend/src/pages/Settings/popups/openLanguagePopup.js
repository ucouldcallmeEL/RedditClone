import styles from "./LanguagePopup.module.css";

function openLanguagePopup(currentLanguage = null) {
  const popup = document.createElement("div");
  popup.className = styles.overlay;

  popup.innerHTML = `
    <div class="${styles.popup}">
      <h2 class="${styles.title}">Display Language</h2>

      <div class="${styles.option}" data-value="English">
        English
        <span class="${styles.check}">✔</span>
      </div>

      <div class="${styles.option}" data-value="Arabic">
        Arabic
        <span class="${styles.check}">✔</span>
      </div>

      <div class="${styles.option}" data-value="French">
        French
        <span class="${styles.check}">✔</span>
      </div>

      <div class="${styles.option}" data-value="German">
        German
        <span class="${styles.check}">✔</span>
      </div>

      <div class="${styles.footer}">
        <button id="lang-save" class="${styles.save}">Done</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  let selected = currentLanguage;

  const optionElems = popup.querySelectorAll(`.${styles.option}`);

  optionElems.forEach((opt) => {
    const check = opt.querySelector(`.${styles.check}`);

    
    check.style.opacity = "0";

    if (opt.dataset.value === currentLanguage) {
      check.style.opacity = "1";
    }

    opt.onclick = () => {
      optionElems.forEach(o => {
        const c = o.querySelector(`.${styles.check}`);
        c.style.opacity = "0";
      });

      check.style.opacity = "1";
      selected = opt.dataset.value;
    };
  });

  return new Promise((resolve) => {
    document.getElementById("lang-save").onclick = () => {
      popup.remove();
      resolve(selected);
    };
  });
}

export default openLanguagePopup;
