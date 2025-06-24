import "../css/main.css"
import { useRef } from "react";
import { useTimerContext } from "../contexts/TimerContext.jsx";
import { useWordContext } from "../contexts/WordContext.jsx";

function ControlButton({ type = null, inputFocus = null, testReset }) {
    const { resetWordList } = useWordContext();
    const { timeLimit, setTimeRemaining, testActive, setTestActive, setTestFinished, loopTest, setLoopTest } = useTimerContext();

    function handleControlClick() {
        switch (type) {
            case "restart_alt":
                if (!loopTest) {
                    resetWordList()
                }
                else if (typeof testReset === "function") {
                    testReset();
                }
                break;
            case "all_inclusive":
                setLoopTest((l) => !l);
                break;
            case "arrows_input":
                if (inputFocus.current)
                    inputFocus.current.focus();
                break;
            default:
                break;
        }
    }

    return (
        <button className="control-btn" onClick={handleControlClick}><span className="material-symbols-outlined">{type}</span></button>
    )
}

function Controls({ inputFocus, testReset }) {
    return (
        <>
            {<ControlButton type={"restart_alt"} inputFocus={inputFocus} testReset={testReset}></ControlButton>}
            {<ControlButton type={"arrows_input"} inputFocus={inputFocus}></ControlButton>}
            {<ControlButton type={"all_inclusive"}></ControlButton>}
        </>
    )
}

export default Controls;