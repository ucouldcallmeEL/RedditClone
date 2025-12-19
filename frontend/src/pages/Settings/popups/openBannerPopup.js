import styles from "./PopupBannerInput.module.css";

export default function openBannerPopup(currentPreview = null) {
  const popup = document.createElement("div");
  popup.className = styles.overlay;

  popup.innerHTML = `
    <div class="${styles.popup}">
      <h3 class="${styles.title}">Banner image</h3>

      <div class="${styles.dropZone}" id="drop-zone">
        <input 
          type="file" 
          accept="image/png, image/jpeg"
          id="file-input"
          class="${styles.fileInput}"
        >

        <div id="drop-content" class="${styles.dropContent}">
          <span class="${styles.dropText}">Drop file or</span>
          <button class="${styles.uploadBtn}" id="upload-btn">⬆️</button>
        </div>

        <div id="hint-row" class="${styles.hintRow}">
          <span class="${styles.hintLeft}">Formats: JPG, PNG</span>
          <span class="${styles.hintRight}">Max size: 500 KB</span>
        </div>
      </div>

      <div class="${styles.buttons}">
        <button id="popup-cancel" class="${styles.cancel}">Cancel</button>
        <button id="popup-save" class="${styles.save}">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const dropZone = popup.querySelector("#drop-zone");
  const fileInput = popup.querySelector("#file-input");
  const uploadBtn = popup.querySelector("#upload-btn");
  const dropContent = popup.querySelector("#drop-content");
  const hintRow = popup.querySelector("#hint-row");

  let selectedFile = null;
  let selectedPreview = currentPreview || null;

    function hideOverlayText() {
        dropContent.style.display = "none";
        hintRow.style.display = "none";
    }

    // function showOverlayText() {
    //     dropContent.style.display = "flex";
    // }

  if (currentPreview) {
    dropZone.style.backgroundImage = `url('${currentPreview}')`;
    dropZone.style.backgroundSize = "cover";
    dropZone.style.backgroundPosition = "center";
    hideOverlayText();
  }

  uploadBtn.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add(styles.dropHover);
  };

  dropZone.ondragleave = () => {
    dropZone.classList.remove(styles.dropHover);
  };

  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove(styles.dropHover);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  function handleFile(file) {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG and PNG are allowed.");
      return;
    }

    if (file.size > 500 * 1024) {
      alert("Max allowed size is 500 KB.");
      return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      selectedPreview = reader.result;

      dropZone.style.backgroundImage = `url('${selectedPreview}')`;
      dropZone.style.backgroundSize = "cover";
      dropZone.style.backgroundPosition = "center";
      hideOverlayText();
    };
    reader.readAsDataURL(file);
  }


  return new Promise((resolve) => {
    document.getElementById("popup-cancel").onclick = () => {
      popup.remove();
      resolve(null);
    };

    document.getElementById("popup-save").onclick = () => {
      popup.remove();

      if (!selectedFile || !selectedPreview) {
        resolve(null);
        return;
      }

      resolve({
        file: selectedFile,
        preview: selectedPreview,
      });
    };
  });
}
