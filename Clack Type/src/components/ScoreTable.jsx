import { useState, useEffect } from "react"
import "../css/main.css"
import { useWordContext } from "../contexts/WordContext.jsx";

function ScoreTable() {
    const { previousScore, maxScore, avgScore, setPreviousScore, setMaxScore, setAvgScore } = useWordContext();

    useEffect(() => {
        if (previousScore > maxScore)
            setMaxScore(previousScore)


    }, [previousScore])

    return (
        <div className="score-container">
            <ul className="score-list">
                <li className="score-item">Previous: {previousScore}</li>
                <li className="score-item">Highest: {maxScore}</li>
                <li className="score-item">Average: {avgScore}</li>
            </ul>
        </div>
    )
}

export default ScoreTable;