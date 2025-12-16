import styles from "./ViewPopup.module.css"

function openViewPopup(currentView="Card"){
    const popup = document.createElement("div");
    popup.className = styles.overlay;

    popup.innerHTML = `
    <div class="${styles.popup}">
        <h2 class="${styles.title}">Default feed view</h2>

        <div class="${styles.option}" data-value="Card">
            <div class="${styles.left}">
                <span class="${styles.icon}">
                <!-- Card icon SVG -->
                <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="6" rx="2"></rect>
                    <rect x="3" y="14" width="18" height="6" rx="2"></rect>
                </svg>
                </span>
                <span>Card</span>
            </div>
            <span class="${styles.check}">✔</span>
        </div>

        <div class="${styles.option}" data-value="Compact">
            <div class="${styles.left}">
                <span class="${styles.icon}">
                <!-- Compact icon SVG -->
                <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="3" rx="1"></rect>
                    <rect x="3" y="11" width="18" height="3" rx="1"></rect>
                    <rect x="3" y="17" width="18" height="3" rx="1"></rect>
                </svg>
                </span>
                <span>Compact</span>
            </div>
        <span class="${styles.check}">✔</span>
        </div>

        <div class="${styles.footer}">
        <button id="lang-save" class="${styles.save}">Done</button>
        </div>
    </div>
    `;

    document.body.appendChild(popup);

    let selected = currentView;

    const optionElems = popup.querySelectorAll(`.${styles.option}`);

    optionElems.forEach((opt) => {
    const check = opt.querySelector(`.${styles.check}`);

    
    check.style.opacity = "0";

    if (opt.dataset.value === currentView) {
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
export default openViewPopup