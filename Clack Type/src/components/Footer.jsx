function Footer() {
    return (
        <footer>
            <div className="content-container full-width content-grid">
                <div className="links-container">
                    <a href="https://michaelcesena.com/#contact">Contact</a>
                    <a href="https://github.com/mlcesena">GitHub</a>
                </div>
                <p className="text-neutral-200 fw-semi-bold" style={{ textAlign: "center" }}>Created by Michael Cesena ({new Date().getFullYear()})</p>
                <span className="text-neutral-200" style={{ textAlign: "center" }}>
                    Inspired by&thinsp;
                    <a id="inspo-link" href="https://monkeytype.com">@monkeytype</a>
                </span>
            </div>
        </footer>
    )
}

export default Footer;