

function Section({title , children}){

    return(
        <div className="section-container">
            <h2>{title}</h2>
            <div className="section-children">
                {children}
            </div>
        </div>
    );

}
export default Section;