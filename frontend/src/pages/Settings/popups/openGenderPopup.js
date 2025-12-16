import styles from "./GenderPopup.module.css";

function openGenderPopup(currentGender = null) {
  const popup = document.createElement("div");
  popup.className = styles.overlay;

  popup.innerHTML = `
    <div class="${styles.popup}">
      <h2 class="${styles.title}">Gender</h2>
      <p class="${styles.description}">
        This information may be used to improve your recommendations and ads.
      </p>

      <div class="${styles.option}" data-value="Woman">Woman</div>
      <div class="${styles.option}" data-value="Man">Man</div>

      <div class="${styles.footer}">
        <button id="gender-cancel" class="${styles.cancel}">Cancel</button>
        <button id="gender-save" class="${styles.save}">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  let selected = currentGender;

  const optionElems = popup.querySelectorAll(`.${styles.option}`);

  optionElems.forEach((opt) => {
    
    if (opt.dataset.value === currentGender) {
      opt.classList.add(styles.selected);
    }


    opt.onclick = () => {
      optionElems.forEach((o) => o.classList.remove(styles.selected));
      opt.classList.add(styles.selected);
      selected = opt.dataset.value;
    };
  });

  return new Promise((resolve) => {
    document.getElementById("gender-save").onclick = () => {
      popup.remove();
      resolve(selected);
    };

    document.getElementById("gender-cancel").onclick = () => {
      popup.remove();
      resolve(null);
    };
  });
}

export default openGenderPopup;
