import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Animated,
  PanResponder,
  Easing,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const GameScreen = () => {
  const { t, i18n } = useTranslation();
  const [age, setAge] = useState<string>("");
  const [gameCategory, setGameCategory] = useState<
    "6-12" | "13-20" | "20-50" | null
  >(null);

  // Load language preference on component mount
  React.useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("language");
      if (storedLang) {
        i18n.changeLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  const handleAgeSubmit = () => {
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber)) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return;
    }

    if (ageNumber >= 6 && ageNumber <= 12) {
      setGameCategory("6-12");
    } else if (ageNumber >= 13 && ageNumber <= 20) {
      setGameCategory("13-20");
    } else if (ageNumber >= 21 && ageNumber <= 50) {
      setGameCategory("20-50");
    } else {
      Alert.alert("Invalid Age", "Age must be between 6 and 50.");
    }
  };

  // Game for 6-12: Drag and Drop (Healthy Food Sorting)
  const DragAndDropGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([
      {
        id: 1,
        name: "Apple",
        type: "healthy",
        position: new Animated.ValueXY(),
      },
      {
        id: 2,
        name: "Pizza",
        type: "unhealthy",
        position: new Animated.ValueXY(),
      },
      {
        id: 3,
        name: "Broccoli",
        type: "healthy",
        position: new Animated.ValueXY(),
      },
      {
        id: 4,
        name: "Candy",
        type: "unhealthy",
        position: new Animated.ValueXY(),
      },
    ]);
    const [activeItem, setActiveItem] = useState<null | number>(null); // Track the currently dragged item

    const handleDrop = (
      item: {
        id: number;
        name: string;
        type: string;
        position: Animated.ValueXY;
      },
      gestureState: any
    ) => {
      const dropZoneHealthy = gestureState.moveY < 300; // Drop zone for healthy food
      const dropZoneUnhealthy = gestureState.moveY >= 300; // Drop zone for unhealthy food

      if (
        (item.type === "healthy" && dropZoneHealthy) ||
        (item.type === "unhealthy" && dropZoneUnhealthy)
      ) {
        setScore(score + 1);
        setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      }

      // Reset the item's position after dropping
      Animated.spring(item.position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();

      // Clear the active item
      setActiveItem(null);
    };

    const panResponder = (item: {
      id: number;
      name: string;
      type: string;
      position: Animated.ValueXY;
    }) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setActiveItem(item.id); // Set the active item when dragging starts
        },
        onPanResponderMove: Animated.event(
          [null, { dx: item.position.x, dy: item.position.y }],
          {
            useNativeDriver: false,
          }
        ),
        onPanResponderRelease: (_, gestureState) => {
          handleDrop(item, gestureState);
        },
      });

    const nextLevel = () => {
      if (level < 3) {
        setLevel(level + 1);
        setItems([
          {
            id: 1,
            name: "Carrot",
            type: "healthy",
            position: new Animated.ValueXY(),
          },
          {
            id: 2,
            name: "Soda",
            type: "unhealthy",
            position: new Animated.ValueXY(),
          },
          {
            id: 3,
            name: "Salad",
            type: "healthy",
            position: new Animated.ValueXY(),
          },
          {
            id: 4,
            name: "Burger",
            type: "unhealthy",
            position: new Animated.ValueXY(),
          },
        ]);
      } else {
        Alert.alert("Congratulations!", "You completed all levels!");
      }
    };

    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>
          {t("healthy_food_sorting")} - {t("level")} {level}
        </Text>
        <Text>
          {t("score")}: {score}
        </Text>

        {/* Drop Zones */}
        <View style={styles.dropZoneHealthy}>
          <Text>{t("healthy_food")}</Text>
        </View>
        <View style={styles.dropZoneUnhealthy}>
          <Text>{t("unhealthy_food")}</Text>
        </View>

        {/* Draggable Items */}
        {items.map((item) => {
          const panResponderInstance = panResponder(item);
          return (
            <Animated.View
              key={item.id}
              style={{
                transform: [
                  { translateX: item.position.x },
                  { translateY: item.position.y },
                ],
                position: "absolute",
                zIndex: activeItem === item.id ? 1 : 0, // Bring the active item to the front
              }}
              {...panResponderInstance.panHandlers}
            >
              <View style={styles.draggableBox}>
                <Text>{item.name}</Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Next Level Button */}
        {items.length === 0 && (
          <TouchableOpacity style={styles.button} onPress={nextLevel}>
            <Text style={styles.buttonText}>{t("next_level")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Game for 13-20: Quiz Game (Health and Nutrition)
  const QuizGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questionsByLevel = [
      [
        {
          question: "Which food is rich in Vitamin C?",
          options: ["Banana", "Orange", "Cheese", "Bread"],
          answer: "Orange",
        },
        {
          question: "How much water should you drink daily?",
          options: ["1 liter", "2 liters", "3 liters", "4 liters"],
          answer: "2 liters",
        },
      ],
      [
        {
          question: "What is the main benefit of exercise?",
          options: [
            "Weight gain",
            "Improved mood",
            "Less sleep",
            "More stress",
          ],
          answer: "Improved mood",
        },
        {
          question: "Which nutrient is essential for muscle repair?",
          options: ["Carbohydrates", "Fats", "Proteins", "Sugars"],
          answer: "Proteins",
        },
      ],
    ];

    const handleAnswer = (answer: string) => {
      if (answer === questionsByLevel[level - 1][currentQuestion].answer) {
        setScore(score + 1);
      }
      if (currentQuestion < questionsByLevel[level - 1].length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    };

    const nextLevel = () => {
      if (level < 2) {
        setLevel(level + 1);
        setCurrentQuestion(0);
        setShowResult(false);
      } else {
        Alert.alert("Congratulations!", "You completed all levels!");
      }
    };

    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>
          {t("health_quiz")} - {t("level")} {level}
        </Text>
        {showResult ? (
          <>
            <Text style={styles.resultText}>
              {t("your_score")}: {score}/{questionsByLevel[level - 1].length}
            </Text>
            <TouchableOpacity style={styles.button} onPress={nextLevel}>
              <Text style={styles.buttonText}>{t("next_level")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.questionText}>
              {questionsByLevel[level - 1][currentQuestion].question}
            </Text>
            {questionsByLevel[level - 1][currentQuestion].options.map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </>
        )}
      </View>
    );
  };

  // Game for 20-50: Puzzle Game (Healthy Habits)
  const PuzzleGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [currentHabit, setCurrentHabit] = useState<string | null>(null);
    const spinValue = useRef(new Animated.Value(0)).current;

    // Healthy habits and their benefits
    const habits = [
      { habit: "Exercise", benefit: "Improves mood and energy" },
      { habit: "Drink Water", benefit: "Keeps you hydrated and healthy" },
      { habit: "Eat Vegetables", benefit: "Provides essential vitamins" },
      { habit: "Sleep Well", benefit: "Boosts immunity and focus" },
    ];

    // Spin the wheel
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const startSpin = () => {
      // Reset spin value
      spinValue.setValue(0);

      // Randomly select a habit
      const randomIndex = Math.floor(Math.random() * habits.length);
      const selectedHabit = habits[randomIndex].habit;
      setCurrentHabit(selectedHabit);

      // Animate the spin
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };

    // Handle benefit selection
    const handleBenefitSelection = (selectedBenefit: string) => {
      const correctBenefit = habits.find((h) => h.habit === currentHabit)
        ?.benefit;
      if (selectedBenefit === correctBenefit) {
        setScore(score + 1);
        Alert.alert("Correct!", "You matched the habit to its benefit!");
      } else {
        Alert.alert("Incorrect", "Try again!");
      }

      // Move to the next level after 3 correct matches
      if (score + 1 >= 3) {
        if (level < 3) {
          setLevel(level + 1);
          setScore(0);
        } else {
          Alert.alert("Congratulations!", "You completed all levels!");
        }
      }
    };

    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>
          {t("healthy_habits_puzzle")} - {t("level")} {level}
        </Text>
        <Text>
          {t("score")}: {score}
        </Text>

        {/* Spinning Wheel */}
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View style={styles.spinningWheel}>
            {habits.map((h, index) => (
              <Text key={index} style={styles.wheelText}>
                {h.habit}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Spin Button */}
        <TouchableOpacity style={styles.button} onPress={startSpin}>
          <Text style={styles.buttonText}>Spin the Wheel</Text>
        </TouchableOpacity>

        {/* Matching Game */}
        {currentHabit && (
          <View style={styles.matchingContainer}>
            <Text style={styles.questionText}>
              {t("match_habit")}: {currentHabit}
            </Text>
            {habits.map((h, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleBenefitSelection(h.benefit)}
              >
                <Text style={styles.optionText}>{h.benefit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderGame = () => {
    switch (gameCategory) {
      case "6-12":
        return <DragAndDropGame />;
      case "13-20":
        return <QuizGame />;
      case "20-50":
        return <PuzzleGame />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />
      <LinearGradient
        colors={["#26A69A", "#00695C"]}
        style={styles.gradientContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!gameCategory ? (
            <View style={styles.ageInputContainer}>
              <View style={styles.headerContainer}>
                <MaterialIcons name="games" size={48} color="#FFF" />
                <Text style={styles.title}>🎮 {t("health_games")}</Text>
                <Text style={styles.subtitle}>{t("learn_while_play")}</Text>
              </View>

              <View style={styles.inputCard}>
                <Feather
                  name="user"
                  size={24}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputLabel}>Enter Your Age</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g., 15"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleAgeSubmit}
                >
                  <Feather
                    name="play"
                    size={20}
                    color="#FFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Start Playing</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.gameWrapper}>{renderGame()}</View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#26A69A",
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  ageInputContainer: {
    width: "100%",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#E8EAF6",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E8EAF6",
  },
  inputIcon: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#FF7043",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 28,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF7043",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  gameWrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    margin: 10,
  },
  gameContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 24,
    textAlign: "center",
  },
  dropZoneHealthy: {
    width: "100%",
    height: 120,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  dropZoneUnhealthy: {
    width: "100%",
    height: 120,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#F44336",
    borderStyle: "dashed",
  },
  draggableBox: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#26A69A",
  },
  spinningWheel: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#E8EAF6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#26A69A",
    shadowColor: "#26A69A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wheelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  matchingContainer: {
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    borderRadius: 15,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginVertical: 6,
    width: "90%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#26A69A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "500",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20,
  },
  puzzlePiece: {
    width: 100,
    height: 100,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default GameScreen;
