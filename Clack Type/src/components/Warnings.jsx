import { useState, useEffect } from "react";

function WarningLabel({ text = "" }) {
    return (
        <div className="warning-container">
            <h2 className="fs-body fw-semi-bold">{text}</h2>
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
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onFocus = () => setShow(false);
        const onBlur = () => setShow(true);
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
    return show;
}

/**
 * FIX DISPLAYING INPUT WARNING WHEN TEST IS DONE
 */
function Warnings({ inputFocus }) {
    const capsOn = useCapsLockWarning();
    const hasFocus = useInputFocusWarning(inputFocus);

    return (
        <>
            {capsOn && <WarningLabel text="Caps Lock" />}
            {hasFocus && <WarningLabel text="Input Focus" />}
        </>
    )
}

export default Warnings;