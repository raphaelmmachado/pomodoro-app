import { useEffect, useState } from "react";
import {
  PlayPauseIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
const beep = new Audio("/beep.mp3");
function App() {
  const [session, setSession] = useState<number>(25);
  const [breakLength, setBreakLength] = useState(5);
  const [clock, setClock] = useState<number>();
  const [runInterval, setRunInterval] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number>(session);
  const [title, setTitle] = useState<"Session" | "Break">("Session");
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    setClock(activeTimer * 60);
  }, [activeTimer]);

  useEffect(() => {
    if (clock === 0) {
      beep.play();
      setActiveTimer((prev) => (prev === breakLength ? session : breakLength));
      setTitle((prev) => (prev === "Break" ? "Session" : "Break"));
    }
  }, [clock]);

  useEffect(() => {
    setRunInterval(false);
    setSession(25);
    setBreakLength(5);
    setTitle("Session");
    setActiveTimer(session);
  }, [reset]);

  useEffect(() => {
    let intervalId: number;

    if (!runInterval) return () => clearInterval(intervalId);
    else {
      intervalId = setInterval(() => {
        setClock((prev) => {
          if (!prev) {
            prev = activeTimer * 60;
          }

          if (prev > 0) return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [runInterval]);

  const formatTimer = () => {
    if (typeof clock === "undefined") return;
    const min = Math.floor(clock / 60);
    const sec = clock % 60;
    return `${min < 10 ? `0${min}` : min} : ${sec < 10 ? `0${sec}` : sec}`;
  };

  return (
    <main
      id="app"
      className="min-h-screen grid place-content-center gap-10 bg-blue-200"
    >
      <audio src="/beep.mp3" id="beep" />
      <section className="flex flex-col justify-center items-center rounded-lg shadow-md border bg-blue-50 border-indigo-300 p-4">
        <h1
          id="timer-label"
          className={`text-center uppercase font-bold text-lg ${
            title === "Session" ? "text-indigo-800" : "text-green-800"
          }`}
        >
          {title}
        </h1>

        <span
          id="time-left"
          className={`text-6xl italic ${
            title === "Session" ? "text-indigo-900" : "text-green-800"
          }`}
        >
          {formatTimer()}
        </span>

        <div className="flex gap-4 my-3">
          <button
            id="start_stop"
            onClick={() => setRunInterval((prev) => !prev)}
          >
            <PlayPauseIcon className="w-10 h-10 text-blue-900 active:scale-105 hover:text-blue-800" />
          </button>{" "}
          <button
            id="reset"
            onClick={() => {
              setRunInterval(false);
              setSession(25);
              setBreakLength(5);
              setTitle("Session");
              setActiveTimer(session);
              setClock(25 * 60);
            }}
          >
            <ArrowPathIcon className="w-10 h-10 text-blue-900 active:scale-105 hover:text-blue-800" />
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-evenly gap-10">
          {" "}
          <div className="flex flex-col items-center  rounded-lg shadow-md border bg-blue-50 border-indigo-300 p-4 ">
            <h2 id="session-label">Session Length</h2>
            <span className="flex gap-5">
              <button
                id="session-decrement"
                onClick={() => {
                  !runInterval &&
                    setActiveTimer(session - 1 > 0 ? session - 1 : session);
                  !runInterval &&
                    setSession((prev) => (prev - 1 > 0 ? prev - 1 : prev));
                }}
              >
                <MinusIcon className="w-5 h-5 text-blue-900" />
              </button>

              <div id="session-length">{session}</div>

              <button
                id="session-increment"
                onClick={() => {
                  !runInterval && setActiveTimer(session + 1);
                  !runInterval && setSession((prev) => prev + 1);
                }}
              >
                <PlusIcon className="w-5 h-5 text-blue-900" />
              </button>
            </span>
          </div>
          <div className="flex flex-col items-center  rounded-lg shadow-md border bg-blue-50 border-indigo-300 p-4">
            <h2 id="break-label">Break Length</h2>
            <span className="flex gap-5">
              <button
                id="break-decrement"
                onClick={() =>
                  !runInterval &&
                  setBreakLength((prev) => (prev - 1 > 0 ? prev - 1 : prev))
                }
              >
                <MinusIcon className="w-5 h-5 text-blue-900" />
              </button>

              <div id="break-length">{breakLength}</div>

              <button
                id="break-increment"
                onClick={() =>
                  !runInterval &&
                  setBreakLength((prev) => (prev + 1 <= 60 ? prev + 1 : prev))
                }
              >
                <PlusIcon className="w-5 h-5 text-blue-900" />
              </button>
            </span>
          </div>
        </div>
      </section>
      <br />
    </main>
  );
}

export default App;
