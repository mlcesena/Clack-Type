import { useState, useEffect } from "react"
import "../css/main.css"
import { useStatContext } from "../contexts/StatContext.jsx";
import DeleteButton from "./DeleteButton.jsx"

function ScoreTable() {
    const { previousScore, maxScore, avgScore, setPreviousScore, setMaxScore, setAvgScore, totalScore, totalTestCount } = useStatContext();

    useEffect(() => {
        if (previousScore > maxScore)
            setMaxScore(previousScore)

        setAvgScore(totalTestCount === 0 ? 0 : (totalScore / totalTestCount).toFixed(1))

    }, [previousScore])

    return (
        <div className="score-container">
            <ul className="score-list">
                <li className="score-item">Last: {previousScore}</li>
                <li className="score-item">High: {maxScore}</li>
                <li className="score-item">Avg: {avgScore}</li>
            </ul>
            <DeleteButton></DeleteButton>
        </div>
    )
}

export default ScoreTable;