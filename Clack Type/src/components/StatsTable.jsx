import { useState, useEffect, useRef } from "react";
import { useWordContext } from "../contexts/WordContext.jsx";

function StatsTable() {
    const { timeLimit, correctLetterCount, typedLetterCount, correctWordCount, typedWordCount } = useWordContext();

    return (
        <div className="content-container" style={{ maxWidth: "500px" }}>
            <h2 className="fs-sub-heading fw-semi-bold">Statistics</h2>
            <div className="stat-grid">
                <div className="stat-item">
                    <h3 className="stat-title">Configuration</h3>
                    <p className="fs-stat clr-primary-400">{timeLimit}s</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-title">Words Per Minute</h3>
                    <p className="fs-stat clr-primary-400">{`${timeLimit < 60 ? (correctWordCount * (60.0 / timeLimit)) : (correctWordCount / (timeLimit / 60.0))}`}</p>
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