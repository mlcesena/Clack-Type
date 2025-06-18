import { generateWordSet } from "../services/WordHandler";
import Word from "./Word.jsx";
import Timer from '../components/Timer.jsx'
import ResetButton from '../components/ResetButton.jsx'
import { useState, useEffect, useRef } from "react";
import { useWordContext } from "../contexts/WordContext.jsx";

function WordContainer() {
    const [input, setInput] = useState("");
    const [letterStates, setLetterStates] = useState([]);
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const [cursorPositions, setCursorPositions] = useState([0, 22]);
    const { words, resetWordList, activeWordIndex, activeLetterIndex, setActiveWordIndex, setActiveLetterIndex } = useWordContext();
    const inputRef = useRef(null);
    const backspacePressed = useRef(false);

    // Handler for key combination controls [restarting test, selecting focus, etc.]
    useEffect(() => {
        const handleKeyCombo = (e) => {
            if (e.shiftKey && e.key == "Enter") {
                resetWordList();
            }
            else if (e.ctrlKey && e.key === "Enter") {
                inputRef.current.focus()
                setInputHasFocus(true)
            }
        }

        document.addEventListener("keydown", handleKeyCombo);

        return () => {
            document.removeEventListener("keydown", handleKeyCombo)
        }
    }, []);

    // Updates the {letterStates} arrays whenever the words list is changed
    useEffect(() => {
        setLetterStates(words.map(word => Array(word.length).fill(null)));
        setInput("");
        inputRef.current.focus();
        setInputHasFocus(true)
    }, [words])

    // Updates {activeWord} state to the next word
    function selectNextWord() {
        setActiveWordIndex((a) => a + 1)
    }

    // Utility function to update the state of each letter when typing
    function updateLetterState(value, targetWordIdx, targetLetterIdx) {
        setLetterStates(prevStates =>
            prevStates.map((wordStates, wordIdx) => // Breaks previous states into each word array and its index
                wordIdx === targetWordIdx // Checks if the current array is the target word's array of states
                    ? wordStates.map((letterState, letterIdx) => // Breaks word states into each letter and its index
                        letterIdx === targetLetterIdx ? value : letterState // Checks if the current index is the target letter's state index
                    )
                    : wordStates // Uses the previous state value
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

    // Move the position of the cursor based on the active leter or word
    function moveCursor(x, y) {
        if (cursorPositions[0] + x < 0) x = 0;
        if (cursorPositions[1] + y < 0) y = 0;
        setCursorPositions((p) => p.map((value, idx) => idx === 0 ? value + x : value + y))
    }

    // Handle any changes to the input
    function handleInputChange(event) {
        setInput(event.target.value);
        console.log("im getting called")

        // Handle press of space
        if (event.target.value.endsWith(" ") && (event.target.value.charAt(event.target.value.length - 2) != " ")) {
            if (backspacePressed.current === true) {
                backspacePressed.current = false;
                return
            }

            let x = 17;
            let y = 0;

            // Determine if cursor needs to move down a row
            if (activeWordIndex + 1 < words.length) {
                const wordContainer = document.querySelector(".word-container");
                const currentY = wordContainer.children[activeWordIndex].getBoundingClientRect().top;
                const nextY = wordContainer.children[activeWordIndex + 1].getBoundingClientRect().top;
                if (nextY > currentY) {
                    x = -cursorPositions[0];
                    y = 42;
                }
            }

            selectNextWord();
            setActiveLetterIndex(0)
            moveCursor(x, y);
        }
        else if (event.target.value.length > input.length) { // Handle all other key presses
            validateInput(event.target.value)
            setActiveLetterIndex((a) => a + 1)
            moveCursor(17, 0);
        }
        /**
         * Filter out non alpha-numeric?
         */
    }

    // Handle backspace inputs
    function handleKeyDown(event) {
        if (event.key === "Backspace") {
            backspacePressed.current = true; // Variable to prevent backspace from affecting word selection in handleInputChange
            if (activeLetterIndex > 0) { // Decrement letter index in active word
                setActiveLetterIndex((a) => a - 1)
                updateLetterState(null, activeWordIndex, activeLetterIndex - 1)
                moveCursor(-17, 0);
            }
            else if (activeWordIndex > 0) { // Move to previous word
                let x = -17;
                let y = 0;

                // determine if cursor needs to move up a row
                if (activeWordIndex - 1 >= 0) {
                    const wordContainer = document.querySelector(".word-container");
                    const currentY = wordContainer.children[activeWordIndex].getBoundingClientRect().top;
                    const previousY = wordContainer.children[activeWordIndex - 1].getBoundingClientRect().top;
                    if (previousY < currentY) {
                        x = -cursorPositions[0];
                        y = -42;
                    }

                }

                setActiveWordIndex((a) => a - 1)
                setActiveLetterIndex((a) => words[a].length)
                moveCursor(x, y);
            }
        }
        else {
            // Reset ref flag if backspace wasn't pressed 
            backspacePressed.current = false;
        }
    }

    return (
        <div className="content-container content-grid">
            <Timer></Timer>
            <div className="test-wrapper">
                <input
                    className="typing-input"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoFocus
                    ref={inputRef}></input>
                <div id="cursor" hidden={!inputHasFocus} style={{ left: `${cursorPositions[0]}px`, top: `${cursorPositions[1]}px` }}></div>
                <div className="word-container">
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
            </div>
            <ResetButton></ResetButton>
        </div>
    )
}

export default WordContainer;