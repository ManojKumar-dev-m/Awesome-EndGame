import React from "react";
import Header from "./Components/Header";
import Status from "./Components/Status";
import Language from "./Components/Language";
import Word from "./Components/Word";
import Keyboard from "./Components/Keyboard";
import { languages } from "./languages.js";
import clsx from "clsx";
import { getFarewellText } from "./utils.js";
import { getWord } from "./utils.js";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function App() {

  const language = languages;

  //State Values
  const [currentWord, setCurrentWord] = React.useState(() => getWord());
  const [guessedLetters, setGuessedLetters
] = React.useState([]);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);

  //Derived Values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter),
  ).length;
  const maxWrongGuesses = language.length - 1;
  const numbGuessLeft = maxWrongGuesses - wrongGuessCount;
  const isGameWon = [...currentWord].every((letter) =>
    guessedLetters.includes(letter),
  );
  const isGameLost = wrongGuessCount >= maxWrongGuesses;

  const isGameOver = isGameLost || isGameWon;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
  lastGuessedLetter && !currentWord.includes(lastGuessedLetter);


  //Static Values
  const alphabet = "qwertyuiopasdfghjklzxcvbnm";
  const { width, height } = useWindowSize();

  React.useEffect(() => {
    if (isGameWon) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isGameWon]);

  React.useEffect(() => {
    if (isGameLost) {
      setShowOverlay(true);

      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 2000); // ⏱️ 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isGameLost]);

  function addGuessedLetter(letter) {
    setGuessedLetters
((previousLetters) => {
      const letterSet = new Set(previousLetters);
      letterSet.add(letter);
      return Array.from(letterSet);
    });
  }

  function startNewGame() {
    setCurrentWord(getWord());
    setGuessedLetters
([]);
  }

  const languageElement = language.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };

    const isLanguageLost = index < wrongGuessCount;

    return (
      <span
        className={clsx("chip", isLanguageLost && "lost")}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    );
  });

  const currentWordArray = [...currentWord];
  const eachElement = currentWordArray.map((letter, index) => {
    const revelLetter = isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx(
      "letter",
      isGameLost && !guessedLetters.includes(letter) && "missed-letter",
    );
    return (
      <span className={letterClassName} key={index}>
        {revelLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyElement = [...alphabet].map((key) => {
    const isGuessed = guessedLetters.includes(key);
    const isCorrect = isGuessed && currentWord.includes(key);
    const isWrong = isGuessed && !currentWord.includes(key);
    return (
      <button
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(key)}
        aria-label={`Letter ${key}`}
        onClick={() => addGuessedLetter(key)}
        key={key}
        className={clsx(
          "key-letter",
          isCorrect && "correct",
          isWrong && "wrong",
        )}
      >
        {key.toUpperCase()}
      </button>
    );
  });

  {
    /* Combined visually-hidden aria-live region for status updates Functon */
  }
  function reader() {
    return (
      <>
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The Letter ${lastGuessedLetter} is in the Word`
            : `Wrong! The Letter ${lastGuessedLetter} is not in the Word`}
          You have {numbGuessLeft} left.
        </p>
        <p>
          Current Word:{" "}
          {[...currentWord]
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank.",
            )
            .join(" ")}
          eachElement={eachElement}
        </p>
      </>
    );
  }

  return (
    <main>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          gravity={0.3}
          recycle={false}
          tweenDuration={1500}
          colors={["#59E391", "#7EF3B6", "#5035FF", "#FFD166"]}
          style={{ pointerEvents: "none" }}
        />
      )}
      {showOverlay && <div className="overlay">Game Over 😢</div>}
      <Header />
      <Status
        over={isGameOver}
        won={isGameWon}
        lost={isGameLost}
        incorrectGuess={isLastGuessIncorrect}
        farwell={getFarewellText(language[wrongGuessCount - 1]?.name)}
      />
      <Language languageElements={languageElement} />
      <Word screenReader={reader} eachElement={eachElement} />
      <Keyboard keyElement={keyElement} />
      {isGameOver && (
        <button onClick={startNewGame} className="new-btn">
          New Game
        </button>
      )}
    </main>
  );
}
