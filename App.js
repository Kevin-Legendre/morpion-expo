import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { MdRestartAlt } from "react-icons/md";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const defaultCases = ["", "", "", "", "", "", "", "", ""];

export default function App() {
  const [cases, setCases] = useState(defaultCases);
  const [player, setPlayer] = useState("X");
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    checkGameState(cases, player);
  }, [cases]);

  const changePlayer = () => {
    setPlayer(player === "X" ? "O" : "X");
  };

  const handleCaseClick = (target, index) => {
    if (gameState === null) {
      if (cases[index] === "") {
        setCases(() => [
          ...cases.map((c, i) => {
            if (i === index) {
              return player;
            }
            return c;
          }),
        ]);
        changePlayer();
      }
    }
  };

  const checkGameState = (cases, player) => {
    if (gameState === null) {
      for (let i = 0; i < winningCombinations.length; i++) {
        if (
          cases[winningCombinations[i][0]] === player &&
          cases[winningCombinations[i][0]] ===
            cases[winningCombinations[i][1]] &&
          cases[winningCombinations[i][0]] === cases[winningCombinations[i][2]]
        ) {
          setGameState({
            sentence: `Joueur ${player} gagne`,
          });
        }
      }
      if (isFull(cases)) {
        setGameState({
          sentence: `Egalité`,
        });
      }
    }
  };

  const isFull = (cases) => {
    let full = true;
    for (let i = 0; i < cases.length; i++) {
      if (cases[i] === "") {
        full = false;
      }
    }
    return full;
  };

  const restart = () => {
    setCases(defaultCases);
    setGameState(null);
    setPlayer("X");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Morpion</Text>
        {!gameState && (
          <Text style={styles.players}>Au tour de {player} de jouer</Text>
        )}
        {gameState && <Text style={styles.players}>{gameState.sentence}</Text>}
      </View>
      <View style={styles.body}>
        {cases.map((c, index) => {
          if(gameState != null) {
          return <DisabledCase
            value={c}
            key={index}/>
          }
          return <Case
            value={c}
            handleCaseClick={handleCaseClick}
            key={index}
            index={index}
          />
        })}
      </View>
      <View style={styles.buttons}>
        {gameState != null && (
          <Pressable style={styles.button} onPressIn={restart}>
            <Text style={styles.players}>restart</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.stats}>
        <Text style={styles.stats1}>stats</Text>
      </View>
      <StatusBar hidden="true" />
    </View>
  );
}

function Case({ value, handleCaseClick, index }) {
  return (
    <View style={styles.caseContainer}>
      <Pressable
        style={styles.case}
        onPressIn={({ target }) => handleCaseClick(target, index)}
      >
        <Text style={styles.caseText}>{value}</Text>
      </Pressable>
    </View>
  );
}

function DisabledCase({ value }) {
  return (
    <View style={styles.caseContainer}>
      <View style={styles.case}>
        <Text style={styles.caseText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  players: {
    textAlign: "center",
    color: "#959595",
    fontSize: 18,
  },
  body: {
    flex: 3,
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
    padding: 1,
    marginTop: -10,
    marginBottom: Platform.OS === "ios" ? -20 : 30,
  },
  caseContainer: {
    flex: 1,
    minWidth: windowWidth * 0.25,
    minHeight: windowWidth * 0.25,
    maxWidth: windowWidth * 0.25,
    maxHeight: windowWidth * 0.25,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  case: {
    margin: 5,
    backgroundColor: "#2D2D2D",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: windowWidth * 0.25,
    minHeight: windowWidth * 0.25,
    maxWidth: windowWidth * 0.25,
    maxHeight: windowWidth * 0.25,
  },
  caseText: {
    color: "#FFFFFF",
    fontSize: Platform.OS === "ios" ? 70 : 110,
    textTransform: "uppercase",
  },
  buttons: {
    flex: 1,
    paddingTop: 30,
  },
  stats: {
    flex: 1,
    backgroundColor: "green",
  },
  button: {
    width: 50,
  },
});
