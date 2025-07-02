function Footer() {
    return (
        <footer>
            <div className="content-container">
                <div className="links-container">
                    <a href="https://michaelcesena.com/#contact" className="link-text ff-title">Contact</a>
                    <a href="https://github.com/mlcesena" className="link-text ff-title">GitHub</a>
                </div>
                <p className="text-neutral-200 fw-semi-bold ff-detail" style={{ textAlign: "center" }}>Created by Michael Cesena ({new Date().getFullYear()})</p>
                <p className="text-neutral-200 ff-detail" style={{ textAlign: "center" }}>
                    Inspired by&thinsp;&thinsp;
                    <a id="inspo-link" href="https://monkeytype.com">@monkeytype</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer;