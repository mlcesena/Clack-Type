import { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const useTimerContext = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const [testActive, setTestActive] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [timeLimit, setTimeLimit] = useState();
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [loopTest, setLoopTest] = useState(false);

    useEffect(() => {
        const storedTimeLimit = localStorage.getItem("timeLimit");

        if (storedTimeLimit != null)
            setTimeLimit(JSON.parse(storedTimeLimit));
        else
            setTimeLimit(30);
    }, [])

    useEffect(() => {
        if (timeLimit > 0)
            localStorage.setItem("timeLimit", JSON.stringify(timeLimit));
    }, [timeLimit]);

    const value = {
        testActive,
        testFinished,
        timeLimit,
        timeRemaining,
        loopTest,
        setTestActive,
        setTestFinished,
        setTimeLimit,
        setTimeRemaining,
        setLoopTest,
    }

    return (
        <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
    )
}