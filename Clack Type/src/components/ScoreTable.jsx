import { useState } from "react"
import "../css/main.css"

function ScoreTable() {
    const [previousScore, setPreviousScore] = useState(0)
    const [maxScore, setMaxScore] = useState(0)
    const [avgScore, setAvgScore] = useState(0)
    const [minScore, setMinScore] = useState(0)

    return (
        <div className="score-container">
            <ul className="score-list">
                <li className="score-item">Previous: {previousScore}</li>
                <li className="score-item">Max: {maxScore}</li>
                <li className="score-item">Average: {avgScore}</li>
                <li className="score-item">Min: {minScore}</li>
            </ul>
        </div>
    )
}

export default ScoreTable;