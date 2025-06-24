import { createContext, useState, useContext, useEffect } from "react";

const StatContext = createContext();

export const useStatContext = () => useContext(StatContext);

export const StatProvider = ({ children }) => {
    const [correctWordCount, setCorrectWordCount] = useState(0);
    const [typedWordCount, setTypedWordCount] = useState(0);
    const [correctLetterCount, setCorrectLetterCount] = useState(0);
    const [typedLetterCount, setTypedLetterCount] = useState(0);
    const [previousScore, setPreviousScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [avgScore, setAvgScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [totalTestCount, setTotalTestCount] = useState(0);

    useEffect(() => {
        const storedPreviousScore = localStorage.getItem("previousScore");
        const storedMaxScore = localStorage.getItem("maxScore");
        const storedAvgScore = localStorage.getItem("avgScore");
        const storedTotalScore = localStorage.getItem("totalScore");
        const storedTotalTestCount = localStorage.getItem("totalTestCount");

        if (storedPreviousScore != null) setPreviousScore(JSON.parse(storedPreviousScore));
        else setPreviousScore(0);

        if (storedMaxScore != null) setMaxScore(JSON.parse(storedMaxScore));
        else setMaxScore(0);

        if (storedAvgScore != null) setAvgScore(JSON.parse(storedAvgScore));
        else setAvgScore(0);

        if (storedTotalScore != null) setTotalScore(JSON.parse(storedTotalScore));
        else setTotalScore(0);

        if (storedTotalTestCount != null) setTotalTestCount(JSON.parse(storedTotalTestCount));
        else setTotalTestCount(0);
    }, [])

    useEffect(() => {
        if (previousScore >= 0)
            localStorage.setItem("previousScore", JSON.stringify(previousScore));
    }, [previousScore]);

    useEffect(() => {
        if (maxScore >= 0)
            localStorage.setItem("maxScore", JSON.stringify(maxScore));
    }, [maxScore]);

    useEffect(() => {
        if (avgScore >= 0)
            localStorage.setItem("avgScore", JSON.stringify(avgScore));
    }, [avgScore]);

    useEffect(() => {
        if (totalScore >= 0)
            localStorage.setItem("totalScore", JSON.stringify(totalScore));
    }, [totalScore]);

    useEffect(() => {
        if (totalTestCount >= 0)
            localStorage.setItem("totalTestCount", JSON.stringify(totalTestCount));
    }, [totalTestCount]);

    const value = {
        correctWordCount,
        typedWordCount,
        correctLetterCount,
        typedLetterCount,
        previousScore,
        maxScore,
        avgScore,
        totalScore,
        totalTestCount,
        setCorrectWordCount,
        setTypedWordCount,
        setCorrectLetterCount,
        setTypedLetterCount,
        setPreviousScore,
        setMaxScore,
        setAvgScore,
        setTotalScore,
        setTotalTestCount
    }

    return (
        <StatContext.Provider value={value}>{children}</StatContext.Provider>
    )
};