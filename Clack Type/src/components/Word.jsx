import { useState, useEffect } from "react";

function Word({ content = "", activeState = false, typedValue = "", letterIndex, setLetterIndex, letterStates = [] }) {
    const letters = content.split("");
    const [wordTyped, setWordTyped] = useState("")
    const [letterTyped, setLetterTyped] = useState("");
    const [extraLetters, setExtraLetters] = useState("");

    // Determine if word has been fully typed and is correct
    useEffect(() => {
        const wordIsCorrect = () => {
            for (let i = 0; i < letterStates.length; i++) {
                if (letterStates[i] !== "c") {
                    setLetterTyped("");
                    return;
                }
            }

            setLetterTyped("correct");
        }
        wordIsCorrect();
    }, [letterStates])

    useEffect(() => {
        const checkTypedValue = () => {
            if (typedValue === "") { // If nothing has been typed, set the word state to none
                setWordTyped("")
            }
            else if (typedValue === content) { // If typed value and word match, mark as complete
                setWordTyped("complete")
            }
            else if (typedValue !== content && typedValue.length >= content.length) { // If typed value and word don't match, mark as complete wrong
                setWordTyped("incorrect")
            }
            else { // If typed length is less than word, mark as incomplete
                setWordTyped("incomplete")
            }

            // Get extra characters after the length of the word
            const extra = typedValue.slice(content.length);
            if (extra.length > 0) // Change look of typed letters
                setLetterTyped("")

            setExtraLetters(extra) // Update extra letters
        }
        checkTypedValue();
    }, [typedValue])

    // 
    return (
        <div className={`word ${activeState ? "active" : "inactive"} ${wordTyped === "complete" ? "complete" : wordTyped === "incorrect" ? "complete wrong" : ""}`} >
            {letters.map((letter, idx) => (
                <label className={`${letterTyped === "correct" ? "correct" : ""}
                    ${letterStates[idx] === "c" ? "typed" :
                        letterStates[idx] === "i" ? "typed incorrect" : ""}`}
                    key={idx}>{letter}</label>
            ))}
            {extraLetters.split("").map((letter, idx) => (
                <label className="incorrect extra" key={idx}>{letter}</label>
            ))}
        </div>
    )
}

export default Word;