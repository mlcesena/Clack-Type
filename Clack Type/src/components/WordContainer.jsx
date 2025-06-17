import { generateWordSet } from "../services/WordHandler";
import Word from "./Word.jsx";
import Timer from '../components/Timer.jsx'
import ResetButton from '../components/ResetButton.jsx'
import { useState, useEffect } from "react";

function WordContainer() {
    const [input, setInput] = useState("");
    const [words, setWords] = useState([]);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [activeLetterIndex, setActiveLetterIndex] = useState(0);
    const [letterStates, setLetterStates] = useState([]);

    // fetches a new list of words for the test and updates the {words} list
    useEffect(() => {
        const getWordSet = async () => {
            try {
                const wordSet = await generateWordSet();
                setWords(wordSet);
            }
            catch (error) {
                console.log("Failed to get word list", error);
            }
        }
        getWordSet()
    }, [])

    // updates the {letterStates} arrays whenever the words list is changed
    useEffect(() => {
        setLetterStates(words.map(word => Array(word.length).fill(null)));
    }, [words])

    // updates {activeWord} state to the next word
    function selectNextWord() {
        setActiveWordIndex((a) => a + 1)
    }

    // Utility function to update the state of each letter when typing
    function updateLetterState(value, targetWordIdx, targetLetterIdx) {
        setLetterStates(prevStates =>
            prevStates.map((wordStates, wordIdx) => // breaks previous states into each word array and its index
                wordIdx === targetWordIdx // checks if the current array is the target word's array of states
                    ? wordStates.map((letterState, letterIdx) => // breaks word states into each letter and its index
                        letterIdx === targetLetterIdx ? value : letterState // checks if the current index is the target letter's state index
                    )
                    : wordStates // uses the previous state value
            )
        );
    }

    // Verify whether new character is correct or not
    function validateInput(newInput) {
        var value = null
        if (newInput.charAt(input.length) === words[activeWordIndex].charAt(activeLetterIndex)) {
            value = "c"
        }
        else {
            value = "i"
        }

        updateLetterState(value, activeWordIndex, activeLetterIndex)
    }

    // Handle any changes to the input
    function handleInputChange(event) {
        setInput(event.target.value);

        if (event.target.value.endsWith(" ") && (event.target.value.charAt(event.target.value.length - 2) != " ")) {
            selectNextWord();
            setActiveLetterIndex(0)
        }
        else if (event.target.value.length > input.length) {
            validateInput(event.target.value)
            setActiveLetterIndex((a) => a + 1)
        }
    }

    // Handle backspace inputs
    function handleKeyDown(event) {
        if (event.key === "Backspace") {
            if (activeLetterIndex > 0) { // decrement letter index in active word
                setActiveLetterIndex((a) => a - 1)
                updateLetterState(null, activeWordIndex, activeLetterIndex - 1)
            }
            else if (activeWordIndex > 0) { // move to previous word
                setActiveWordIndex((a) => a - 1)
                setActiveLetterIndex((a) => words[a].length)
            }
        }
    }

    return (
        <div className="content-container">
            <Timer></Timer>
            <div>
                <input
                    className=""
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"></input>
            </div>
            <div className="word-container word-content-block">
                {words.map((word, idx) => (
                    <Word
                        content={word}
                        key={word.id}
                        activeState={idx === activeWordIndex}
                        letterIndex={activeLetterIndex}
                        setLetterIndex={setActiveLetterIndex}
                        letterStates={letterStates[idx]}>
                    </Word>
                ))}
            </div>
            <ResetButton></ResetButton>
        </div>
    )
}

export default WordContainer;