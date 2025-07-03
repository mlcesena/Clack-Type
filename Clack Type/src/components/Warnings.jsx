import { useState, useEffect } from "react";
import { useTimerContext } from "../contexts/TimerContext";

function WarningLabel({ text = "" }) {
    return (
        <div className="warning-container">
            <h2 className="fs-body fw-bold ff-detail">{text}</h2>
        </div>
    )
}

function useCapsLockWarning() {
    const [capsOn, setCapsOn] = useState(false);
    useEffect(() => {
        const handleCapsPress = (e) => {
            setCapsOn(e.getModifierState && e.getModifierState("CapsLock"))
        }

        document.addEventListener("keydown", handleCapsPress);
        document.addEventListener("keyup", handleCapsPress);

        return () => {
            document.removeEventListener("keydown", handleCapsPress);
            document.removeEventListener("keyup", handleCapsPress);
        }
    }, []);
    return capsOn;
}

function useInputFocusWarning(inputRef) {
    const { testFinished, testActive } = useTimerContext();
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onFocus = () => setShow(false);
        const onBlur = () => { if (testActive) setShow(true); }
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

    return show;
}

function Warnings({ inputFocus }) {
    const { loopTest } = useTimerContext();
    const capsOn = useCapsLockWarning();
    const hasFocus = useInputFocusWarning(inputFocus);

    return (
        <>
            {loopTest && <WarningLabel text="Loop On" />}
            {capsOn && <WarningLabel text="Caps Lock" />}
            {hasFocus && <WarningLabel text="Input Focus" />}
        </>
    )
}

export default Warnings;