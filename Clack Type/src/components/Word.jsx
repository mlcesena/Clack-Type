import { useState, useEffect } from "react";

function Word({ content = "", activeState = false, letterIndex, setLetterIndex, letterStates = [] }) {
    const letters = content.split("");
    const [typed, setTyped] = useState("")

    // Determine if word has been fully typed and is correct
    useEffect(() => {
        const wordIsCorrect = () => {
            for (let i = 0; i < letterStates.length; i++) {
                if (letterStates[i] !== "c") {
                    setTyped("");
                    return;
                }
            }
            setTyped("correct");
        }
        wordIsCorrect();
    }, [letterStates])

    return (
        <div className={`word ${activeState ? "active" : "inactive"}`} >
            {letters.map((letter, idx) => (
                <label className={`${typed === "correct" ? "correct" : ""}
                    ${letterStates[idx] === "c" ? "typed" :
                        letterStates[idx] === "i" ? "incorrect" : ""}`
                }>{letter}</label>
            ))}
        </div>
    )
}

export default Word;