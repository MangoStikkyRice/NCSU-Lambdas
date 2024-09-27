import './Parallax.scss'

function Parallax({type}) {
    return (
        <div className="parallax">
            <h1>
                {type == "services" ? "slide1" : "slide2"}
            </h1>
            <div className="pic1"></div>
            <div className="pic2"></div>
            <div className="pic3"></div>
        </div>
    )
}

export default Parallax;