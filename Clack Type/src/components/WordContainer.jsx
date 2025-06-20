import Word from "./Word.jsx";
import Timer from '../components/Timer.jsx'
import ResetButton from '../components/ResetButton.jsx'
import { useState, useEffect, useRef } from "react";
import { useWordContext } from "../contexts/WordContext.jsx";

function WordContainer() {
    const [input, setInput] = useState("");
    const [typedWords, setTypedWords] = useState([]);
    const [letterStates, setLetterStates] = useState([]);
    const [inputHasFocus, setInputHasFocus] = useState(false);
    const [cursorPositions, setCursorPositions] = useState([0, 0]);
    const [initCursorY, setInitCursorY] = useState(0);
    const { words, resetWordList, activeWordIndex, activeLetterIndex, testActive, testFinished, setActiveWordIndex, setActiveLetterIndex, setTestActive, setTestFinished, timeLimit, timeRemaining, setTimeRemaining, previousScore, setPreviousScore } = useWordContext();
    const inputRef = useRef(null);
    const backspacePressed = useRef(false);
    const wordContainer = useRef(null);

    // Handler for key combination controls [restarting test, selecting focus, etc.]
    useEffect(() => {
        const handleKeyCombo = (e) => {
            if (e.shiftKey && e.key == "Enter") {
                resetWordList();
            }
            else if (e.ctrlKey && e.key === "Enter") {
                selectInputAsFocus(true)
            }
        }

        document.addEventListener("keydown", handleKeyCombo);

        return () => {
            document.removeEventListener("keydown", handleKeyCombo)
        }
    }, []);

    useEffect(() => {
        moveCursor(0, 0, true);
    }, [initCursorY])

    // Updates the {letterStates} arrays whenever the words list is changed
    useEffect(() => {
        setTypedWords(Array(words.length).fill(""));
        setLetterStates(words.map(word => Array(word.length).fill(null)));
        setInput("");
        setTestActive(false);
        setTimeRemaining(timeLimit);
        setTestFinished(false);
        selectInputAsFocus(true);
        moveCursor(0, 0, true);
    }, [words])

    // Handle score and typing stat calculations
    useEffect(() => {
        if (testFinished) {
            let correct = 0;
            for (let i = 0; i < words.length; i++) {
                if (wordContainer.current.children[i].classList.contains("typed"))
                    correct++
            }
            console.log(activeWordIndex + 1)
            console.log(correct)
            setPreviousScore(correct)
        }
    }, [testFinished])

    // Select the input box as the active focus element
    function selectInputAsFocus(value) {
        if (value) {
            if (inputRef.current) {
                inputRef.current.focus();
                setInputHasFocus(true)
            }
        }
        else {
            setInputHasFocus(false)
        }
    }

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
    function moveCursor(x, y, reset) {
        if (reset) {
            let wordY = wordContainer.current.getBoundingClientRect().top;
            let letterY = wordContainer.current.children.length > 0 ? wordContainer.current.children[0].children[0].getBoundingClientRect().top : 0;
            let letterHeight = wordContainer.current.children.length > 0 ? wordContainer.current.children[0].children[0].getBoundingClientRect().height : 0;

            // Determine what the default y position of the cursor should be for the session
            if (initCursorY === 0 && Math.abs(letterY - wordY + letterHeight / 2) !== wordY) {
                setInitCursorY(letterY - wordY + letterHeight / 2)
            }
            setCursorPositions([0, initCursorY]);
            return;
        }
        // Update the x and y of the cursor by adding the new values
        setCursorPositions((p) => p.map((value, idx) => idx === 0 ? value + x : value + y))
    }

    // Handle any changes to the input
    function handleInputChange(event) {
        if (testFinished)
            return;

        // Start the test
        if (!testActive && timeRemaining > 0) {
            setTestActive(true);
            setPreviousScore(0);
        }

        console.log(activeWordIndex + " " + activeLetterIndex)

        /**
         * FIX ISSUE AFTER STARTING A NEW TEST WHEN YOU HAVE GONE BEYOND THE FIRST 2 LINES
         */

        const currentWord = wordContainer.current.children[activeWordIndex];
        const value = event.target.value;
        let x = 0;
        let y = 0;
        let nextWord = null;

        setInput(value);

        // Update the list of typed values for each word in the test
        setTypedWords(prev => {
            const values = value.split(" ");
            const updated = [...prev];
            updated[activeWordIndex] = values[activeWordIndex];
            return updated;
        });

        /**
         * FIX ISSUE WHEN HITTING SPACE AT THE START OF THE TEST
         */

        // Handle press of space
        if (value.endsWith(" ") && (value.charAt(value.length - 2) != " ")) {
            if (backspacePressed.current === true) {
                backspacePressed.current = false;
                return
            }
            else if (activeWordIndex === words.length - 1) {
                return
            }

            nextWord = wordContainer.current.children[activeWordIndex + 1];
            let nextWordX = nextWord.children[0].getBoundingClientRect().x;
            let currentWordEndX = currentWord.children[activeLetterIndex - 1].getBoundingClientRect().x;
            let nextLetterWidth = nextWord.children[0].getBoundingClientRect().width;

            x += nextWordX - currentWordEndX - nextLetterWidth;

            // Determine if cursor needs to move down a row
            if (activeWordIndex + 1 < words.length) {
                const currentY = currentWord.getBoundingClientRect().top;
                const nextY = nextWord.getBoundingClientRect().top;

                if ((currentY + (nextY - currentY) * 2) > wordContainer.current.getBoundingClientRect().bottom) {
                    x = -cursorPositions[0];

                    for (let i = activeWordIndex; i >= 0; i--) {
                        if (wordContainer.current.children[i].getBoundingClientRect().top < currentY) {
                            wordContainer.current.children[i].style.display = "none";
                        }
                        else {
                            wordContainer.current.children[i].style.display = "";
                        }
                    }
                }
                else if (nextY > currentY) {
                    x = -cursorPositions[0];
                    y = nextY - currentY;
                }
            }

            selectNextWord();
            setActiveLetterIndex(0)
        }
        else if (value.length > input.length) { // Handle all other key presses (that are not backspace)
            x = currentWord.children[0].getBoundingClientRect().width;

            // Update the state of the current letter then move to the next
            validateInput(value)
            setActiveLetterIndex((a) => a + 1)
        }
        moveCursor(x, y, false);
        /**
         * Filter out non alpha-numeric?
         */
    }

    // Handle backspace inputs
    function handleKeyDown(event) {
        if (testFinished)
            return;

        let x = 0;
        let y = 0;
        let currentWord = wordContainer.current.children[activeWordIndex];
        let prevWord = activeWordIndex > 0 ? wordContainer.current.children[activeWordIndex - 1] : null;

        /**
         * FIX ISSUE WHEN HITTING BACKSPACE AT [0, 0] 
         */
        if (event.key === "Backspace") {
            backspacePressed.current = true; // Variable to prevent backspace from affecting word selection in handleInputChange

            if (activeLetterIndex > 0) { // Decrement letter index in active word
                x = currentWord.children[0].getBoundingClientRect().width;
                setActiveLetterIndex((a) => a - 1)

                updateLetterState(null, activeWordIndex, activeLetterIndex - 1)
            }
            else if (activeLetterIndex === 0 && prevWord.getBoundingClientRect().top === 0) {
                /**
                 * MOVE THIS/CHANGE HOW THIS IS CHECKED
                 */
            }
            else if (activeWordIndex > 0) { // Move to previous word
                let unfinished = false;
                let lastTypedIndex = 0;
                let prevLetterX = 0;
                let prevLetterWidth = 0;
                let currentWordStartX = currentWord.children[0].getBoundingClientRect().x;

                // Determine the last typed letter index if word is uncompleted
                if (!prevWord.classList.contains("complete")) {
                    unfinished = true;

                    // Loop through letters backwards until a letter was typed
                    for (let i = prevWord.children.length - 1; i >= 0; i--) {
                        if (prevWord.children[i].classList.contains("typed")) {
                            lastTypedIndex = i;
                            break;
                        }
                    }
                }
                else {
                    lastTypedIndex = prevWord.children.length - 1;
                }

                // Get x and width of previous word's letter 
                prevLetterX = prevWord.children[lastTypedIndex].getBoundingClientRect().x;
                prevLetterWidth = prevWord.children[lastTypedIndex].getBoundingClientRect().width;

                // Calculate new x position
                x += currentWordStartX - prevLetterX - prevLetterWidth;

                // Determine if cursor needs to move up a row
                if (activeWordIndex - 1 >= 0) {
                    const currentY = currentWord.getBoundingClientRect().top;
                    const previousY = prevWord.getBoundingClientRect().top;

                    // Ignore if previously line is hidden
                    if (previousY === 0) {
                        x = 0;
                        y = 0;
                    } // Move cursor up only words are on different lines
                    else if (previousY < currentY) {
                        y = -(currentY - previousY);
                    }
                }

                if (unfinished)
                    setActiveLetterIndex(lastTypedIndex + 1)
                else
                    setActiveLetterIndex(prevWord.children.length)

                setActiveWordIndex((a) => a - 1)
            }
            moveCursor(-x, y, false);
        }
        else {
            // Reset ref flag if backspace wasn't pressed 
            backspacePressed.current = false;
        }
    }

    return (
        <div className="content-container content-grid">
            <Timer></Timer>
            <div className="typing-wrapper">
                <input
                    id="user-input"
                    className="typing-input"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoFocus
                    ref={inputRef}
                    onFocus={() => { selectInputAsFocus(true) }}
                    onBlur={() => { selectInputAsFocus(false) }}
                    disabled={timeRemaining === 0}></input>
                <div id="cursor" hidden={!(inputHasFocus && timeRemaining !== 0)} style={{ left: `${cursorPositions[0]}px`, top: `${cursorPositions[1]}px` }}></div>
                <div className="word-container" ref={wordContainer} onClick={() => { selectInputAsFocus(true) }}>
                    {words.map((word, idx) => (
                        <Word
                            content={word}
                            key={word.id}
                            typedValue={typedWords[idx]}
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