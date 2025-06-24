import { useState } from "react";
import { useStatContext } from "../contexts/StatContext";
import { useTimerContext } from "../contexts/TimerContext";

function ClearButton() {
    const { setPreviousScore, setMaxScore, setAvgScore, setTotalScore, setTotalTestCount } = useStatContext();
    const { testActive } = useTimerContext();

    function handleClearData() {
        if (!testActive) {
            setPreviousScore(0);
            setMaxScore(0);
            setAvgScore(0);
            setTotalScore(0);
            setTotalTestCount(0);
        }
    }

    return (
        <button className="delete-btn" onClick={handleClearData}>
            Del
        </button>
    )
}

export default ClearButton;