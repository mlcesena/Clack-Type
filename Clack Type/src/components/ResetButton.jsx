import "../css/main.css"
import { useWordContext } from "../contexts/WordContext.jsx";

function ResetButton() {
    const { resetWordList } = useWordContext();

    function handleReset() {
        resetWordList()
    }

    return (
        <button className="reset-btn" onClick={handleReset}>Reset</button>
    )
}

export default ResetButton;