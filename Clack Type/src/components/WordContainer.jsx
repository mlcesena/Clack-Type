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
    const [letterStates, setLetterStates] = useState([]);
    const [cursorPositions, setCursorPositions] = useState([0, 0]);
    const [cursorVisible, setCursorVisible] = useState(false);
    const [initCursorY, setInitCursorY] = useState(0);
    const { words, activeWordIndex, activeLetterIndex, typedWords, setActiveWordIndex, setActiveLetterIndex, setTypedWords, resetWordList } = useWordContext();
    const { testActive, testFinished, setTestActive, setTestFinished, timeLimit, timeRemaining, setTimeRemaining, loopTest, setLoopTest } = useTimerContext();
    const { setPreviousScore, setCorrectWordCount, setTypedWordCount, setCorrectLetterCount, setTypedLetterCount, setTotalTestCount, setTotalScore } = useStatContext();
    const inputRef = useRef(null);
    const cursorRef = useRef(null);
    const backspacePressed = useRef(false);
    const wordContainer = useRef(null);
    const contentContainer = useRef(null);
    const cursorPositionsRef = useRef(cursorPositions);
    const activeWordIndexRef = useRef(activeWordIndex);
    const activeLetterIndexRef = useRef(activeLetterIndex);
    const initCursorYRef = useRef(initCursorY);

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
    }, [loopTest]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => { window.removeEventListener("resize", handleResize) }
    }, [])

    useEffect(() => {
        moveCursor(0, 0, true);
    }, [initCursorY]);

    // Updates the {letterStates} arrays whenever the words list is changed
    useEffect(() => {
        resetTest();
    }, [words]);

    useEffect(() => {
        const onFocus = () => setCursorVisible(false);
        const onBlur = () => { setCursorVisible(true) };
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
    }, [inputRef, testActive]);

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

                // Add to totalLetters only if word was started
                if (currentWord.children[0].classList.contains("typed"))
                    totalLetters += currentWord.children.length;

                // Handle completed words
                if (currentWord.classList.contains("complete") && !currentWord.classList.contains("wrong")) {
                    correctWords++;
                    correctLetters += currentWord.children.length;

                    if (i === activeWordIndex) {
                        wordCount++;
                    }
                }
                else { // Handle incomplete or incorrect words
                    for (let k = 0; k < currentWord.children.length; k++) {
                        if (currentWord.children[k].classList.contains("extra")) {
                            extraLetters++;
                        }
                        else if (currentWord.children[k].classList.contains("incorrect")) {
                            missedLetters++;
                        }
                        else if (currentWord.children[k].classList.contains("typed")) {
                            correctLetters++;
                        }
                    }
                }
            }

            // Update test statistics
            setTotalScore((t) => t + correctWords)
            setTotalTestCount((t) => t + 1)
            setCorrectWordCount(correctWords)
            setTypedWordCount(wordCount)
            setTypedLetterCount(totalLetters)
            setCorrectLetterCount(correctLetters)
            setPreviousScore(correctWords)
        }
    }, [testFinished])

    useEffect(() => {
        cursorPositionsRef.current = cursorPositions;
    }, [cursorPositions]);
    useEffect(() => {
        activeWordIndexRef.current = activeWordIndex;
    }, [activeWordIndex]);
    useEffect(() => {
        activeLetterIndexRef.current = activeLetterIndex;
    }, [activeLetterIndex]);
    useEffect(() => {
        initCursorYRef.current = initCursorY;
    }, [initCursorY]);

    const handleResize = () => {
        if (wordContainer.current) {
            // Cursor x and y
            const cx = cursorPositionsRef.current[0];
            const cy = cursorPositionsRef.current[1];

            // Active letter x and y
            const lx = wordContainer.current.children[activeWordIndexRef.current].children[activeLetterIndexRef.current].getBoundingClientRect().x;
            const ly = wordContainer.current.children[activeWordIndexRef.current].children[activeLetterIndexRef.current].getBoundingClientRect().y;

            // Word Container x and y
            const wx = wordContainer.current.getBoundingClientRect().x;
            const wy = wordContainer.current.getBoundingClientRect().y;

            // Left margin of word
            const ml = parseFloat(getComputedStyle(wordContainer.current.children[activeWordIndexRef.current]).marginLeft)

            const newX = (lx - (wx + ml)) - cx;
            const newY = (ly - (wy + 7)) - (cy - initCursorYRef.current);

            moveCursor(newX, newY, false)
        }
    }

    function resetTest() {
        // Reset display prop of all hidden words
        if (wordContainer.current.children.length > 0) {
            for (let i = 0; i < wordContainer.current.children.length; i++) {
                wordContainer.current.children[i].style.display = "";
            }
        }

        // Reset typed values, states and input value
        setTypedWords(Array(words.length).fill(""));
        setLetterStates(words.map(word => Array(word.length).fill(null)));
        setInput("");

        // Reset word and letter indices
        setActiveWordIndex(0);
        setActiveLetterIndex(0);

        // Reset test parameters/states
        setTestActive(false);
        setTimeRemaining(timeLimit);
        setTestFinished(false);

        // Reset focus and cursor
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
            let cursorHeight = cursorRef.current.getBoundingClientRect().height;

            // Determine what the default y position of the cursor should be for the session
            if (initCursorY === 0 && (Math.abs(letterY - wordY + letterHeight / 2) !== wordY) && cursorRef.current) {
                setInitCursorY(letterY - wordY + (letterHeight / 2) - (cursorHeight / 2))
            }
            setCursorPositions([0, initCursorY]);
            return;
        }
        // Update the x and y of the cursor by adding the new values
        setCursorPositions((p) => p.map((value, idx) => idx === 0 ? value + x : value + y))
    }

    // Remove typed words from view 
    function removeWordRow() {
        const currentWord = wordContainer.current.children[activeWordIndex];
        const currentY = currentWord.getBoundingClientRect().top;

        for (let i = activeWordIndex; i >= 0; i--) {
            if (wordContainer.current.children[i].getBoundingClientRect().top < currentY) {
                wordContainer.current.children[i].style.display = "none";
            }
            else {
                wordContainer.current.children[i].style.display = "";
            }
        }
    }

    // Determine if an additional letter will push word out of boundary
    function wordOutOfBound(dir) {
        const currentWord = wordContainer.current.children[activeWordIndex];
        const letterWidth = currentWord.children[0].getBoundingClientRect().width;
        const typedLength = typedWords[activeWordIndex] ? typedWords[activeWordIndex].length + 1 : 0;
        const wordLength = words[activeWordIndex].length;

        switch (dir) {
            case "right":
                const currentRight = currentWord.getBoundingClientRect().right;
                const contRight = wordContainer.current.getBoundingClientRect().right;

                if ((typedLength > wordLength) && ((currentRight + letterWidth + 8) > contRight)) {
                    return true;
                }

                break;

            default:
                break;
        }

        return false;
    }

    // Determine the last typed index of the previous word
    function getLastTypedIndex() {
        const prevWord = activeWordIndex > 0 ? wordContainer.current.children[activeWordIndex - 1] : null;
        // Loop through letters backwards until a letter was typed
        for (let i = prevWord.children.length - 1; i >= 0; i--) {
            if (prevWord.children[i].classList.contains("typed")) {
                return i;
            }
        }
        return 0;
    }

    /**
     * CAN THE CURSOR LOGIC BE HANDLED BY USE EFFECT?
     */
    // Handle any changes to the input
    function handleInputChange(event) {
        // Prevent input after test ends and limit extra incorrect letters
        if ((testFinished) || (event.target.value.split(" ").at(-1).length === 20))
            return;

        // Start the test
        if (!testActive && timeRemaining > 0 && !event.target.value.endsWith(" ")) {
            setTestActive(true);
            setPreviousScore(0);
        }

        let x = 0;
        let y = 0;
        const value = event.target.value;
        const currentWord = wordContainer.current.children[activeWordIndex];
        const nextWord = activeWordIndex + 1 < words.length ? wordContainer.current.children[activeWordIndex + 1] : null;
        const currentY = currentWord.getBoundingClientRect().top;
        const nextY = nextWord ? nextWord.getBoundingClientRect().top : 0;
        const contBottom = wordContainer.current.getBoundingClientRect().bottom;

        // Accept input if it won't push word out of bounds, backspace or space pressed
        if (!wordOutOfBound("right") || backspacePressed.current || value.endsWith(" ")) {
            // Update the input component's value
            setInput(value);

            // Update the list of typed values for each word in the test
            setTypedWords(prev => {
                const values = value.split(" ");
                const updated = [...prev];
                updated[activeWordIndex] = values[activeWordIndex];
                return updated;
            });
        }
        else {
            return;
        }

        // Handle press of space
        if (value.endsWith(" ")) {
            if (backspacePressed.current) {
                backspacePressed.current = false;
                return;
            }
            else if ((activeWordIndex === words.length - 1) || (activeLetterIndex === 0)) {
                return;
            }

            const nextWordX = nextWord.children[0].getBoundingClientRect().x;
            const currentWordEndX = currentWord.children[activeLetterIndex - 1].getBoundingClientRect().x;
            const nextLetterWidth = nextWord.children[0].getBoundingClientRect().width;

            x += nextWordX - currentWordEndX - nextLetterWidth;

            // Determine if cursor needs to move down a row
            if (activeWordIndex + 1 < words.length) {
                if ((currentY + (nextY - currentY) * 2) > contBottom) {
                    x = -cursorPositions[0];
                    removeWordRow();
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

            // Check typed value is longer than word and if right of word + width + margin is > right boundary
            if (wordOutOfBound("right")) {
                x = -cursorPositions[0] + x * (activeLetterIndex + 1);
                if ((currentY + (nextY - currentY) * 2) <= contBottom) {
                    y = nextY - currentY;
                }
            }

            // Update the state of the current letter then move to the next
            validateInput(value)
            setActiveLetterIndex((a) => a + 1)

        }
        moveCursor(x, y, false);
    }

    // Handle backspace inputs
    function handleKeyDown(event) {
        if (testFinished)
            return;

        if (event.key !== "Backspace") {
            // Reset ref flag if backspace wasn't pressed 
            backspacePressed.current = false;
            return;
        }

        // Ignore backspace on first word's first letter
        if (activeWordIndex === 0 && activeLetterIndex === 0) {
            return
        }

        let x = 0;
        let y = 0;
        const currentWord = wordContainer.current.children[activeWordIndex];
        const currentY = currentWord.getBoundingClientRect().top;
        const currentLeft = currentWord.children[0].getBoundingClientRect().x;
        const prevWord = activeWordIndex > 0 ? wordContainer.current.children[activeWordIndex - 1] : null;
        const previousY = prevWord ? prevWord.getBoundingClientRect().top : 0;

        backspacePressed.current = true; // Variable to prevent backspace from affecting word selection in handleInputChange

        if (activeLetterIndex > 0) { // Decrement letter index in active word
            x = currentWord.children[0].getBoundingClientRect().width;
            // if (prevWord != null) {
            // const prevRight = prevWord.getBoundingClientRect().right;
            // const currentWidth = currentWord.getBoundingClientRect().width;
            // const contRight = wordContainer.current.getBoundingClientRect().right;
            // const typedLength = typedWords[activeWordIndex].length;
            // const wordLength = words[activeWordIndex].length;

            // if ((typedLength > wordLength) && (prevRight + 16 + currentWidth - x + 8 <= contRight)) {
            //     x = -(prevRight - x - 24)
            // if ((currentY !== previousY) && (prevWord.style.display !== "none")) {
            //     y = -(currentY - previousY);
            // }
            // }
            // }

            setActiveLetterIndex((a) => a - 1)
            updateLetterState(null, activeWordIndex, activeLetterIndex - 1)
        }
        else if ((activeWordIndex > 0) && !(activeLetterIndex === 0 && previousY === 0)) { // Move to previous word
            let unfinished = false;
            let lastTypedIndex = 0;

            // Determine the last typed letter index if word is uncompleted
            if (!prevWord.classList.contains("complete")) {
                unfinished = true;
                lastTypedIndex = getLastTypedIndex();
            }
            else {
                lastTypedIndex = prevWord.children.length - 1;
            }

            // Get x and width of previous word's letter 
            const prevLetterX = prevWord.children[lastTypedIndex].getBoundingClientRect().x;
            const prevLetterWidth = prevWord.children[lastTypedIndex].getBoundingClientRect().width;

            // Calculate new x position
            x += currentLeft - prevLetterX - prevLetterWidth;

            // Determine if cursor needs to move up a row
            if (activeWordIndex - 1 >= 0) {
                // Ignore if previously line is hidden
                if (previousY === 0) {
                    x = 0;
                    y = 0;
                } // Move cursor up only words are on different lines
                else if (previousY < currentY) {
                    y = -(currentY - previousY);
                }
            }

            setActiveLetterIndex(unfinished ? (lastTypedIndex + 1) : prevWord.children.length)
            setActiveWordIndex((a) => a - 1)
        }
        moveCursor(-x, y, false);
    }

    return (
        <div className="content-container" ref={contentContainer}>
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
                <div id="cursor" ref={cursorRef} hidden={cursorVisible} style={{ left: `${cursorPositions[0]}px`, top: `${cursorPositions[1]}px` }}></div>
                <div className="word-container" ref={wordContainer} onClick={() => { inputRef.current.focus() }}>
                    {words.map((word, idx) => (
                        <Word
                            content={word}
                            key={idx}
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
            <Controls inputFocus={inputRef} testReset={resetTest}></Controls>
        </div>
    )
}

export default WordContainer;

/**
 * @TODO
 * 
 * Handle deleting row when active word is pushed to 3rd row
 * Rewrite cursor movement logic
 * Dynamically load word elements instead of loading all at once
 * Recalculate WPM
 * Add loading to word container upon reset
 * Handle failure to fetch words
 * General efficiency evalulation
 */