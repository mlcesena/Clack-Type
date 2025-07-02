import "../css/main.css"
import { useTimerContext } from "../contexts/TimerContext.jsx";
import { useWordContext } from "../contexts/WordContext.jsx";

function ControlButton({ type = null, desc = null, inputFocus = null, testReset }) {
    const { resetWordList } = useWordContext();
    const { loopTest, setLoopTest } = useTimerContext();

    function handleControlClick() {
        switch (type) {
            case "restart_alt":
                if (!loopTest) {
                    resetWordList()
                }
                else if (typeof testReset === "function") {
                    testReset();
                }
                break;
            case "all_inclusive":
                setLoopTest((l) => !l);
                break;
            case "arrows_input":
                if (inputFocus.current)
                    inputFocus.current.focus();
                break;
            default:
                break;
        }
    }

    return (
        <button className="control-btn" aria-label={desc} data-title={desc} onClick={handleControlClick}><span className="material-symbols-outlined">{type}</span></button>
    )
}

function Controls({ inputFocus, testReset }) {
    return (
        <div className="control-wrapper">
            <div className="control-container">
                {<ControlButton type={"restart_alt"} desc="Restart test" inputFocus={inputFocus} testReset={testReset}></ControlButton>}
                {<ControlButton type={"arrows_input"} desc="Focus on input" inputFocus={inputFocus}></ControlButton>}
                {<ControlButton type={"all_inclusive"} desc="Loop test content"></ControlButton>}
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
    )
}

export default Controls;