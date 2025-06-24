import { useState, useEffect } from "react"
import "../css/main.css"
import { useStatContext } from "../contexts/StatContext.jsx";
import ClearButton from "./ClearButton.jsx"

function ScoreTable() {
    const { previousScore, maxScore, avgScore, setPreviousScore, setMaxScore, setAvgScore, totalScore, totalTestCount } = useStatContext();

    useEffect(() => {
        if (previousScore > maxScore)
            setMaxScore(previousScore)

        setAvgScore(totalTestCount === 0 ? 0 : (totalScore / totalTestCount).toFixed(1))

    }, [previousScore])

    return (
        <div className="score-container full-width">
            <ul className="score-list">
                <li className="score-item">Previous: {previousScore}</li>
                <li className="score-item">Highest: {maxScore}</li>
                <li className="score-item">Average: {avgScore}</li>
            </ul>
            <ClearButton></ClearButton>
        </div>
    )
}

export default ScoreTable;