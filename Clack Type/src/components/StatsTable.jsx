import { useState, useEffect } from "react";
import { useStatContext } from "../contexts/StatContext.jsx";
import { useTimerContext } from "../contexts/TimerContext.jsx";

function StatsTable() {
    const { correctLetterCount, typedLetterCount, correctWordCount, typedWordCount } = useStatContext();
    const { timeLimit, testFinished } = useTimerContext();
    const [testTime, setTestTime] = useState(0);

    useEffect(() => {
        if (testFinished)
            setTestTime(timeLimit);
    }, [testFinished]);

    return (
        <div className="content-container" style={{ maxWidth: "500px" }}>
            <h2 className="fs-sub-heading fw-medium ff-title">Statistics</h2>
            <div className="stat-grid">
                <div className="stat-item">
                    <h3 className="stat-title">Configuration</h3>
                    <p className="fs-stat clr-primary-400">{testTime}s</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Words Per Minute</h3>
                    <p className="fs-stat clr-primary-400">{`${testTime < 60 ? Math.floor(correctWordCount * (60.0 / testTime)) : Math.floor(correctWordCount / (testTime / 60.0))}`}</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Word Count</h3>
                    <p className="fs-stat clr-primary-400">{`${correctWordCount}/${typedWordCount}`}</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Characters</h3>
                    <p className="fs-stat clr-primary-400">{`${correctLetterCount}/${typedLetterCount}`}</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Word Accuracy</h3>
                    <p className="fs-stat clr-primary-400">{`${((correctWordCount / typedWordCount) * 100).toFixed(1)}%`}</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Character Accuracy</h3>
                    <p className="fs-stat clr-primary-400">{`${((correctLetterCount / typedLetterCount) * 100).toFixed(1)}%`}</p>
                </div>
            </div>
        </div>
    )
}

export default StatsTable;