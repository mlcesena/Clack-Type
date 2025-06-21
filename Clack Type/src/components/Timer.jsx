import "../css/main.css"
import { useWordContext } from "../contexts/WordContext.jsx";
import { useEffect, useState, useRef } from "react";

function Timer() {
    const { testActive, setTestActive, timeLimit, setTimeLimit, timeRemaining, setTimeRemaining, setTestFinished } = useWordContext();
    const [isRunning, setIsRunning] = useState(false);
    const intervalIdRef = useRef(null);

    useEffect(() => {
        if (testActive) {
            setIsRunning(true)
        }
        else
            setIsRunning(false)

    }, [testActive])

    // Check if test is over
    useEffect(() => {
        if (timeRemaining === 0) {
            setIsRunning(false)
            setTestActive(false)
            setTestFinished(true)
        }
    }, [timeRemaining])

    // Perform one interval of the test
    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                setTimeRemaining((t) => t - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalIdRef.current)
        };
    }, [isRunning])

    return (
        <>
            <h2 className="timer">{timeRemaining}</h2>
        </>
    )
}

export default Timer;