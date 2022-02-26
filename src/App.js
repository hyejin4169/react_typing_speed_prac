import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const getCloud = () =>
  `codedamn mehul playground react nextjs macbook windows
elon musk bitcoin dodgecoin cryptocurrency tesla spacex editor coding
html javascript world earth mars heater wood blanket`.split(" ");

//.sort(() => Math.random() > 0.5 ? 1 : -1)

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }

  if (active) {
    return <span className="active">{text} </span>;
  }

  return <span>{text} </span>;
}

Word = React.memo(Word);

function Timer(props) {
  const { correctWords, startCounting } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        // do something
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval();
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div>
      <p>
        <b>Time:</b> {timeElapsed}
      </p>
      <p>
        <b>Speed:</b> {(correctWords / minutes || 0).toFixed(2)} WPM
      </p>
    </div>
  );
}

function App() {
  const [userInput, setUserInput] = useState("");
  const cloud = useRef(getCloud());

  const [startCounting, setStartCounting] = useState(false);

  const [activeWorldIndex, setActiveWorldIndex] = useState(0);
  //첫번째 단어부터 시작해야 하므로 0
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    if (activeWorldIndex === cloud.current.length) {
      return;
      //stop
    }

    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(" ")) {
      //the user has finished this word

      if (activeWorldIndex === cloud.current.length - 1) {
        //why -1? active index from 0
        //overflow
        setStartCounting(false); //you've already completed the game
        setUserInput("Completed");
      } else {
        setUserInput("");
      }

      setActiveWorldIndex((index) => index + 1);

      //correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWorldIndex] = word === cloud.current[activeWorldIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }
  return (
    <div>
      <h1>Typing Test</h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <p>
        {cloud.current.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWorldIndex}
              correct={correctWordArray[index]}
            />
          );
        })}
      </p>
      <input
        placeholder="Start typing.."
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default App;
