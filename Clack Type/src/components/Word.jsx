import { useState } from "react";

function Word({ content = "", activeState = false, letterIndex, setLetterIndex, letterStates = [] }) {
    const letters = content.split("");

    return (
        <div className={`word ${activeState ? "active" : "inactive"}`} >
            {letters.map((letter, idx) => (
                <label className={
                    letterStates[idx] === "c" ? "correct" :
                        letterStates[idx] === "i" ? "incorrect" : ""
                }>{letter}</label>
            ))}
        </div>
    )
}

export default Word;