
function SettingsTab({title , isActive , onShow}){

    return (
        <div className={`setting-tab ${isActive ? "active" : ""}`} onClick={onShow}>
            
            <h3 className={`setting-tab ${isActive ? "active" : ""}`}>{title}</h3>
            
        </div>
    );

}
export default SettingsTab;