import React from "react";
import Overlay from "./Overlay";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import jwt_decode from "jwt-decode";
import axios from "axios";

// SkockoGuessingGame component declaration at the top level
const Game = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }

  const decodedToken = jwt_decode(token);
  const idFromToken = parseInt(decodedToken.id);
  const [userData, setUserData] = useState({});

  const generateRandomNumbers = () => {
    const min = 1;
    const max = 6;
    const randomNumbers = [];

    for (let i = 0; i < 4; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      randomNumbers.push(randomNumber);
    }

    return randomNumbers;
  };

  const [currentGuessRow, setCurrentGuessRow] = useState(1);
  const [currentGuessCol, setCurrentGuessCol] = useState(1);
  const [numberOfGuess, setNumberOfGuess] = useState(1);
  const [niz, setNiz] = useState(generateRandomNumbers());
  const [guessNiz, setGuessNiz] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch user data based on the ID
    axios
      .get(`http://localhost:3000/game/${idFromToken}`)
      .then((response) => {
        setUserData(response.data);
        setScore(response.data.score);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [idFromToken]);
  console.log("Tvo score je    " + score);
  //console.log("niz " + niz);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");
  const showOverlay = (message) => {
    setOverlayMessage(message);
    setOverlayVisible(true);
  };

  const scoringSystem = new Map([
    [1, 100],
    [2, 50],
    [3, 20],
    [4, 10],
    [5, 5],
    [6, 2],
  ]);

  const guess = () => {
    let correct = 0;
    let missplaced = 0;
    let wrong = 0;
    let guessCopy = [...guessNiz];
    let nizCopy = [...niz];
    const correctIndices = []; // Array to store the indices of correct elements

    // Calculate correct elements
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] === nizCopy[i]) {
        correct++;
        correctIndices.push(i); // Store the index that has been counted as correct
        guessCopy[i] += 10;
        nizCopy[i] += 10;
      }
    }

    //Calculate misplaced elements
    for (let i = 0; i < guessCopy.length; i++) {
      if (!correctIndices.includes(i) && nizCopy.includes(guessCopy[i])) {
        missplaced++;
        //      Set the element to null so it won't be considered multiple times
        nizCopy[nizCopy.indexOf(guessCopy[i])] = null;
      }
    }

    wrong = 4 - (correct + missplaced);
    console.log("guess niz " + guessCopy);
    console.log("niz " + nizCopy);
    console.log(correct + " - " + missplaced + " - " + wrong);

    let counterC = 0;
    let counterM = 0;
    for (let i = 1; i < 5; i++) {
      let current = document.getElementById(
        `circle-${i}-row-${currentGuessRow}`
      );
      if (counterC < correct) {
        current.classList.add("bg-red-600");
        counterC++;
      } else if (counterM < missplaced) {
        current.classList.add("bg-yellow-600");
        counterM++;
      } else {
        current.classList.add("bg-white-600");
      }
    }
    console.log("ASDASDASD  " + scoringSystem.get(numberOfGuess));

    if (correct === 4) {
      const newScore = score + scoringSystem.get(numberOfGuess);
      const addScore = scoringSystem.get(numberOfGuess);
      setScore(newScore);
      console.log("Score je trenutno: " + score);
      setTimeout(1000);
      axios
        .put(`http://localhost:3000/game/${idFromToken}`, { score: addScore })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error updating score:", error);
        });
      setTimeout(() => {
        showOverlay("Congrats! You scored " + scoringSystem.get(numberOfGuess));
      }, 500);
    }

    setNumberOfGuess((prev) => prev + 1);
    setCurrentGuessRow((prev) => prev + 1);
    setCurrentGuessCol(0);
    setGuessNiz([]);

    if (numberOfGuess === 6 && correct !== 4) {
      const addScore = 0;
      axios
        .put(`http://localhost:3000/game/${idFromToken}`, { score: addScore })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error updating score:", error);
        });
      setTimeout(() => {
        showOverlay("GAME OVER!");
        //window.location.reload();
      }, 500);
    }
  };

  // useEffect(() => {
  //   console.log(guessNiz); // This will run every time guessNiz is updated
  // }, [guessNiz]);
  const handleGuessSubmission = (value) => {
    const buttonValue = value;
    const currentGuessRowElement = document.getElementById(
      `guess-${currentGuessRow}`
    );

    if (currentGuessRowElement) {
      const emptySquare = currentGuessRowElement.querySelector(
        ".square:not(.filled)"
      );

      if (emptySquare) {
        emptySquare.innerHTML = buttonValue;
        setGuessNiz((prevGuessNiz) => [...prevGuessNiz, buttonValue]);
        emptySquare.classList.add("filled");
      }

      setCurrentGuessCol((prevCol) => prevCol + 1);
      if (currentGuessCol > 4) {
        if (numberOfGuess === currentGuessRow) {
          alert("Submit your guess!");
          return;
        }
        setCurrentGuessRow((prevRow) => prevRow + 1);
        setCurrentGuessCol(0);
      }
    }
  };

  const reset = () => {
    window.location.reload();
  };

  // Helper function to generate the guess row JSX
  const renderGuessRow = (rowId) => (
    <div className="flex space-x-4">
      <div className="guess-row flex space-x-4" id={`guess-${rowId}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`guess-${i + 1}`}
            onClick={() => {
              console.log("clicked niz " + guessNiz);
            }}
            className="square w-16 h-16 flex items-center justify-center text-3xl font-family: ui-monospace rounded border border-white"
          >
            {" "}
          </div>
        ))}
      </div>

      <div id={`feedback-${rowId}`} className="flex flex-col mt-4">
        <div className="feedback-row flex space-x-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`circle-${i + 1}-row-${rowId}`}
              id={`circle-${i + 1}-row-${rowId}`}
              className="circle w-8 h-8 rounded-full border border-white"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center text-white py-8">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`guess-${i + 1}`} className="mb-4">
            {" "}
            {renderGuessRow(i + 1)}
          </div>
        ))}
        <div id="controls" className="flex justify-center mt-4 space-x-4">
          <button
            id="btn1"
            value="1"
            className="guess-btn  px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(1)}
          >
            1
          </button>
          <button
            id="btn2"
            value="2"
            className="guess-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(2)}
          >
            2
          </button>
          <button
            id="btn3"
            value="3"
            className="guess-btn  px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(3)}
          >
            3
          </button>
          <button
            id="btn4"
            value="4"
            className="guess-btn  px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(4)}
          >
            4
          </button>
          <button
            id="btn5"
            value="5"
            className="guess-btn  px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(5)}
          >
            5
          </button>
          <button
            id="btn6"
            value="6"
            className="guess-btn  px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => handleGuessSubmission(6)}
          >
            6
          </button>

          <button
            className="guess-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={guess}
          >
            Submit Guess
          </button>
          <button
            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            onClick={reset}
          >
            Reset Game
          </button>
        </div>

        <div id="score" className="mt-4"></div>
      </div>

      {overlayVisible && (
        <Overlay
          message={overlayMessage}
          onClose={() => setOverlayVisible(false)}
        />
      )}
    </div>
  );
};

export default Game;
