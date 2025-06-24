import Word from "./Word.jsx";
import Timer from '../components/Timer.jsx'
import Controls from './Controls.jsx'
import { useState, useEffect, useRef } from "react";
import { useWordContext } from "../contexts/WordContext.jsx";
import { useTimerContext } from "../contexts/TimerContext.jsx";
import { useStatContext } from "../contexts/StatContext.jsx";
import Warnings from "./Warnings.jsx";
import ScoreTable from '../components/ScoreTable.jsx'

function WordContainer() {
    const [input, setInput] = useState("");
    // const [typedWords, setTypedWords] = useState([]);
    const [letterStates, setLetterStates] = useState([]);
    const [cursorPositions, setCursorPositions] = useState([0, 0]);
    const [cursorVisible, setCursorVisible] = useState(false);
    const [initCursorY, setInitCursorY] = useState(0);
    const { words, activeWordIndex, activeLetterIndex, typedWords, setActiveWordIndex, setActiveLetterIndex, setTypedWords, resetWordList } = useWordContext();
    const { testActive, testFinished, setTestActive, setTestFinished, timeLimit, timeRemaining, setTimeRemaining, loopTest, setLoopTest } = useTimerContext();
    const { setPreviousScore, setCorrectWordCount, setTypedWordCount, setCorrectLetterCount, setTypedLetterCount, setTotalTestCount, setTotalScore } = useStatContext();
    const inputRef = useRef(null);
    const backspacePressed = useRef(false);
    const wordContainer = useRef(null);

    // Handler for key combination controls [restarting test, selecting focus, etc.]
    useEffect(() => {
        const handleKeyCombo = (e) => {
            if (e.shiftKey && e.key == "Enter") {
                if (loopTest) {
                    resetTest();
                }
                else {
                    resetWordList();
                }
            }
            else if (e.ctrlKey && e.key === "Enter") {
                inputRef.current.focus()
            }
            else if (e.ctrlKey && e.key === "l") {
                setLoopTest((l) => !l);
            }
        }

        document.addEventListener("keydown", handleKeyCombo);

        return () => {
            document.removeEventListener("keydown", handleKeyCombo);
        }
    }, []);

    useEffect(() => {
        moveCursor(0, 0, true);
    }, [initCursorY]);

    // Updates the {letterStates} arrays whenever the words list is changed
    useEffect(() => {
        resetTest();
    }, [words]);

    useEffect(() => {
        const onFocus = () => setCursorVisible(false);
        const onBlur = () => setCursorVisible(true);
        const node = inputRef.current;
        if (node) {
            node.addEventListener('focus', onFocus);
            node.addEventListener('blur', onBlur);
        }

        return () => {
            if (node) {
                node.removeEventListener('focus', onFocus);
                node.removeEventListener('blur', onBlur);
            }
        };
    }, [inputRef]);

    // Handle score and typing stat calculations
    useEffect(() => {
        if (testFinished) {
            let correctWords = 0;
            let totalLetters = 0;
            let correctLetters = 0;
            let missedLetters = 0;
            let extraLetters = 0;
            let wordCount = activeWordIndex;

            for (let i = 0; i < activeWordIndex + 1; i++) {
                const currentWord = wordContainer.current.children[i];

                /** 
                 * FIX ISSUE WHERE NON TYPED WORDS ARE INCLUDED IN LETTER COUNT
                 */
                totalLetters += currentWord.children.length;
                if (currentWord.classList.contains("complete") && !currentWord.classList.contains("wrong")) {
                    correctWords++;
                    correctLetters += currentWord.children.length;

                    if (i === activeWordIndex) {
                        wordCount++;
                    }
                }
                else {
                    for (let k = 0; k < currentWord.children.length; k++) {
                        if (currentWord.children[k].classList.contains("extra")) {
                            extraLetters++;
                        }
                        else if (currentWord.children[k].classList.contains("incorrect")) {

                        }
                        else if (currentWord.children[k].classList.contains("typed")) {
                            correctLetters++;
                        }
                    }
                }
            }

            setTotalScore((t) => t + correctWords)
            setTotalTestCount((t) => t + 1)
            setCorrectWordCount(correctWords)
            setTypedWordCount(wordCount)
            setTypedLetterCount(totalLetters)
            setCorrectLetterCount(correctLetters)

            setPreviousScore(correctWords)
        }
    }, [testFinished])

    function resetTest() {
        if (wordContainer.current.children.length > 0) {
            for (let i = 0; i < wordContainer.current.children.length; i++) {
                wordContainer.current.children[i].style.display = "";
            }
        }
        setTypedWords(Array(words.length).fill(""));
        setLetterStates(words.map(word => Array(word.length).fill(null)));
        setInput("");
        setActiveWordIndex(0);
        setActiveLetterIndex(0);
        setTestActive(false);
        setTimeRemaining(timeLimit);
        setTestFinished(false);
        inputRef.current.focus()
        moveCursor(0, 0, true);
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

    /**
     * CAN THE CURSOR LOGIC BE HANDLED BY USE EFFECT?
     */
    // Handle any changes to the input
    function handleInputChange(event) {
        if (testFinished)
            return;

        // Start the test
        if (!testActive && timeRemaining > 0) {
            setTestActive(true);
            setPreviousScore(0);
        }

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

        // Handle press of space
        if (value.endsWith(" ") && (value.charAt(value.length - 2) != " ")) {
            if (backspacePressed.current === true) {
                backspacePressed.current = false;
                return;
            }
            else if (activeWordIndex === words.length - 1) {
                return;
            }
            else if (activeWordIndex === 0 && activeLetterIndex === 0) {
                return;
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

        if (event.key === "Backspace") {
            backspacePressed.current = true; // Variable to prevent backspace from affecting word selection in handleInputChange

            if (activeWordIndex === 0 && activeLetterIndex === 0) {
                return
            }

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
            <ScoreTable></ScoreTable>
            <div className="info-bar">
                <Timer></Timer>
                <div className="warning-wrapper">
                    <Warnings inputFocus={inputRef}></Warnings>
                </div>
            </div>
            <div className="typing-wrapper">
                <input
                    id="user-input"
                    className="typing-input"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="off"
                    autoFocus
                    ref={inputRef}
                    disabled={timeRemaining === 0}></input>
                <div id="cursor" hidden={cursorVisible} style={{ left: `${cursorPositions[0]}px`, top: `${cursorPositions[1]}px` }}></div>
                <div className="word-container" ref={wordContainer} onClick={() => { inputRef.current.focus() }}>
                    {words.map((word, idx) => (
                        <Word
                            content={word}
                            key={word.id}
                            typedValue={typedWords[idx]}
                            disabled={true}
                            activeState={idx === activeWordIndex}
                            letterIndex={activeLetterIndex}
                            setLetterIndex={setActiveLetterIndex}
                            letterStates={letterStates[idx]}>
                        </Word>
                    ))}
                </div>
            </div>
            <div className="control-wrapper">
                <div className="control-container">
                    <Controls inputFocus={inputRef} testReset={resetTest}></Controls>
                </div>
                <div className="control-shortcuts">
                    <div>
                        <span className="key">Shift</span>
                        &thinsp;&thinsp;+&thinsp;&thinsp;
                        <span className="key">Enter</span>
                        &thinsp;&thinsp;-&thinsp;&thinsp;&thinsp;Restart
                    </div>
                    <div>
                        <span className="key">Ctrl</span>
                        &thinsp;&thinsp;+&thinsp;&thinsp;
                        <span className="key">Enter</span>
                        &thinsp;&thinsp;-&thinsp;&thinsp;&thinsp;Focus
                    </div>
                    <div>
                        <span className="key">Ctrl</span>
                        &thinsp;&thinsp;+&thinsp;&thinsp;
                        <span className="key">L</span>
                        &thinsp;&thinsp;-&thinsp;&thinsp;&thinsp;Loop
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WordContainer;