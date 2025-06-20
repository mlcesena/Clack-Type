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
            if (typedValue === "") {
                setWordTyped("")
            }
            else if (typedValue === content) {
                setWordTyped("complete")
            }
            else if (typedValue !== content && typedValue.length >= content.length) {
                setWordTyped("incorrect")
            }
            else {
                setWordTyped("incomplete")
            }
            const letters = typedValue.slice(content.length);
            if (letters.length > 0)
                setLetterTyped("")
            setExtraLetters(letters)
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