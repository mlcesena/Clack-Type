import "../css/main.css"
import { useTimerContext } from "../contexts/TimerContext.jsx";
import { useEffect, useState, useRef } from "react";

function Timer() {
    const { testActive, setTestActive, timeLimit, setTimeLimit, timeRemaining, setTimeRemaining, testFinished, setTestFinished } = useTimerContext();
    const [isRunning, setIsRunning] = useState(false);
    // const [timerValue, setTimerValue] = useState(1);
    const intervalIdRef = useRef(null);
    const timerPresetRef = useRef(null);
    const timerRef = useRef(null);

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

    useEffect(() => {
        if (timerPresetRef.current) {
            for (let i = 0; i < timerPresetRef.current.children.length; i++) {
                if (timerPresetRef.current.children[i].innerHTML == timeLimit) {
                    timerPresetRef.current.children[i].classList = "active"
                }
                else {
                    timerPresetRef.current.children[i].classList = ""
                }
            }
        }

        if (!testActive) {
            setTimeRemaining(timeLimit);
            // timerRef.current.value = timeLimit;
            // setTimerValue(timeLimit);
        }

    }, [timeLimit])

    // useEffect(() => {
    //     // if (!testFinished)
    //     //     setTimerValue(timeLimit)

    // }, [testFinished])

    function handleTimerChange(e) {
        const val = e.target.value;


        // if (Number.isInteger(val) && val < 1000) {
        //     setTimeLimit((val < 1000) ? val : 1);
        //     // setTimerValue((val < 1000) ? val : 1)
        // }
        // else if (val.length === 0) {
        //     // setTimerValue(undefined)
        // }
        // else {
        //     return;
        // }
    }

    function handleTimerClick(value) {
        if ((timeLimit + value < 1 || timeLimit + value > 120) || testActive || testFinished)
            return

        setTimeLimit((t) => t + value)
    }

    function handlePresetClick(value) {
        if (testActive || testFinished)
            return

        setTimeLimit(value);
    }

    return (
        <div className="timer-wrapper">
            {/* <input
                className="timer"
                disabled={true}
                ref={timerRef}
                // value={timeRemaining ?? 1}
                onChange={handleTimerChange}
                onBlur={() => {
                    if (timerRef.current.value.length === 0) { setTimeLimit(1); }
                }}
            /> */}
            <h2 className="timer">{timeRemaining}</h2>
            <div className="timer-controls" >
                <button className="timer-btn" onClick={() => handleTimerClick(-1)}>-</button>

                <ul className="timer-presets" ref={timerPresetRef}>
                    <li onClick={() => handlePresetClick(15)}>15</li>
                    <li onClick={() => handlePresetClick(30)} className="active">30</li>
                    <li onClick={() => handlePresetClick(60)}>60</li>
                    <li onClick={() => handlePresetClick(120)}>120</li>
                </ul>

                <button className="timer-btn" onClick={() => handleTimerClick(1)}>+</button>
            </div>


        </div>
    )
}

export default Timer;