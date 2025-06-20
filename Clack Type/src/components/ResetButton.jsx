import "../css/main.css"
import { useWordContext } from "../contexts/WordContext.jsx";

function ResetButton() {
    const { resetWordList, timeLimit, setTimeRemaining, testActive, setTestActive, setTestFinished } = useWordContext();

    function handleReset() {
        resetWordList()
        setTestActive(false)
        setTimeRemaining(timeLimit)
        setTestFinished(false)
    }

    return (
        <button className="reset-btn" onClick={handleReset}>Reset</button>
    )
}

export default ResetButton;