import styles from "./PopupImageInput.module.css";


export default function openImagePopup(currentPreview = null) {
  const popup = document.createElement("div");
  popup.className = styles.overlay;

  popup.innerHTML = `
    <div class="${styles.popup}">
      <h3 class="${styles.title}">Avatar image</h3>

      <div class="${styles.imageContainer}">
        <div class="${styles.uploadBox}" id="upload-box">
          <div class="${styles.previewCircle}" id="preview-circle">
            <span class="${styles.uploadIcon}" id="upload-icon">⬆️</span>
          </div>
          <p class="${styles.uploadText}">Select a new image</p>

          <input 
            type="file" 
            accept="image/*" 
            id="file-input"
            class="${styles.fileInput}"
          >
        </div>
      </div>

      <div class="${styles.buttons}">
        <button id="popup-cancel" class="${styles.cancel}">Cancel</button>
        <button id="popup-save" class="${styles.save}">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const fileInput = popup.querySelector("#file-input");
  const uploadBox = popup.querySelector("#upload-box");
  const previewCircle = popup.querySelector("#preview-circle");
  const uploadIcon = popup.querySelector("#upload-icon");

  let selectedFile = null;     
  let selectedPreview = null;  

  if (currentPreview) {
    previewCircle.style.backgroundImage = `url('${currentPreview}')`;
    previewCircle.style.backgroundSize = "cover";
    previewCircle.style.backgroundPosition = "center";
    uploadIcon.style.display = "none";
  }


  uploadBox.onclick = () => fileInput.click();


  fileInput.onchange = (e) => {
    selectedFile = e.target.files[0] || null;

    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      selectedPreview = reader.result;
      previewCircle.style.backgroundImage = `url('${selectedPreview}')`;
      previewCircle.style.backgroundSize = "cover";
      previewCircle.style.backgroundPosition = "center";
      uploadIcon.style.display = "none";
    };
    reader.readAsDataURL(selectedFile);
  };


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
