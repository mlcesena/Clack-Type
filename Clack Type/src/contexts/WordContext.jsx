import { generateWordSet } from "../services/WordHandler";
import { createContext, useState, useContext, useEffect } from "react";

const WordContext = createContext();

export const useWordContext = () => useContext(WordContext);

export const WordProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [typedWords, setTypedWords] = useState([])
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [activeLetterIndex, setActiveLetterIndex] = useState(0);
    const [testActive, setTestActive] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [timeLimit, setTimeLimit] = useState(30);
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [correctWordCount, setCorrectWordCount] = useState(0);
    const [previousScore, setPreviousScore] = useState(0)
    const [maxScore, setMaxScore] = useState(0)
    const [avgScore, setAvgScore] = useState(0)

    useEffect(() => {
        getWordSet()
    }, [])

    /**
     * Needs to be implemented for tracking wpm
     */
    useEffect(() => {
        setTypedWords(words.map((word, idx) => { idx: "" }))
    }, [words])

    // Utility function to handle fetching of word list
    const getWordSet = async () => {
        try {
            const wordSet = await generateWordSet();
            setWords(wordSet);
        }
        catch (error) {
            console.log("Failed to get word list", error);
        }
    }

    // Resets the word list and the active indices
    const resetWordList = () => {
        setActiveWordIndex(0);
        setActiveLetterIndex(0);
        getWordSet();
    };

    const value = {
        words,
        activeWordIndex,
        activeLetterIndex,
        typedWords,
        testActive,
        testFinished,
        timeLimit,
        timeRemaining,
        correctWordCount,
        previousScore,
        maxScore,
        avgScore,
        setActiveWordIndex,
        setActiveLetterIndex,
        setTypedWords,
        setTestActive,
        setTestFinished,
        setTimeLimit,
        setTimeRemaining,
        setCorrectWordCount,
        setPreviousScore,
        setMaxScore,
        setAvgScore,
        resetWordList,
    };

    return (
        <WordContext.Provider value={value}>{children}</WordContext.Provider>
    )
};