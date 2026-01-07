import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Modal, Dimensions, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Trophy, Zap, Star } from "lucide-react-native";
import { BlurView } from 'expo-blur';

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  animValue: Animated.Value;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUBBLE_COLORS = [
  'rgba(100, 200, 255, 0.8)',
  'rgba(150, 100, 255, 0.8)',
  'rgba(255, 150, 200, 0.8)',
  'rgba(100, 255, 200, 0.8)',
  'rgba(255, 200, 100, 0.8)',
  'rgba(52, 211, 153, 0.8)',
  'rgba(251, 146, 60, 0.8)',
];

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.75,
    borderRadius: 32,
    overflow: 'hidden' as const,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject as { position: 'absolute' },
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginTop: 4,
  },
  scoreDisplay: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '900' as const,
  },
  closeModalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject as { position: 'absolute' },
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  gameOverIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    marginBottom: 8,
  },
  gameOverScore: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 24,
  },
  gameOverButton: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 160,
    justifyContent: 'center',
  },
  gameOverButtonText: {
    fontSize: 16,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
  },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  gameScore: {
    fontSize: 18,
    fontWeight: "800" as const,
  },
  closeGameButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeGameText: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  gameArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    marginBottom: 4,
  },
  gameInstruction: {
    fontSize: 11,
    fontWeight: "500" as const,
    marginBottom: 20,
  },
  bubble: {
    position: "absolute" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleInner: {
    width: "100%",
    height: "100%",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleHighlight: {
    position: "absolute" as const,
    width: "40%",
    height: "40%",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: "15%",
    left: "20%",
  },
});

export function LaundryGame({ 
  visible,
  onClose, 
  colors 
}: { 
  visible: boolean;
  onClose: () => void;
  colors: any;
}) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const bubbleIdRef = useRef(0);
  const gameWidth = SCREEN_WIDTH * 0.92 - 40;
  const gameHeight = SCREEN_HEIGHT * 0.75 - 180;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const modalRotateAnim = useRef(new Animated.Value(0)).current;
  const gameOverScaleAnim = useRef(new Animated.Value(0)).current;
  const gameOverBounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      modalScaleAnim.setValue(0);
      modalRotateAnim.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(modalRotateAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setGameStarted(true);
    });
  }, [visible]);

  useEffect(() => {
    if (!gameStarted) return;

    const spawnInterval = setInterval(() => {
      const x = Math.random() * (gameWidth - 80);
      const size = 50 + Math.random() * 30;
      const speed = 3000 + Math.random() * 2000;
      const animValue = new Animated.Value(0);

      const newBubble: Bubble = {
        id: bubbleIdRef.current++,
        x,
        y: gameHeight,
        size,
        speed,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        animValue,
      };

      setBubbles(prev => [...prev, newBubble]);

      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
        }
      });
    }, 600);

    return () => {
      clearInterval(spawnInterval);
    };
  }, [gameStarted, gameWidth, gameHeight]);

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
      
      Animated.sequence([
        Animated.spring(gameOverScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(gameOverBounceAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(gameOverBounceAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [gameOver, score, highScore]);

  const handleBubblePop = (bubbleId: number) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setScore(prev => prev + 10);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalRotateAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBubbles([]);
      setScore(0);
      setGameOver(false);
      setGameStarted(false);
      gameOverScaleAnim.setValue(0);
      onClose();
    });
  };

  const handleRestart = () => {
    Animated.timing(gameOverScaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setBubbles([]);
      setScore(0);
      setGameOver(false);
      setGameStarted(true);
    });
  };

  const modalScale = modalScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const modalRotate = modalRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const gameOverBounce = gameOverBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              borderColor: colors.tint,
              transform: [
                { scale: modalScale },
                { rotate: modalRotate },
              ],
            },
          ]}
        >
          {Platform.OS === 'ios' && (
            <BlurView intensity={20} style={styles.modalBlur} tint="dark" />
          )}
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.tint }]}>Pop the Bubbles! 🫧</Text>
                <Text style={[styles.modalSubtitle, { color: colors.tabIconDefault }]}>Tap to clean them all</Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.closeModalButton, { backgroundColor: `${colors.error}20`, borderColor: colors.error }]}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 24, color: colors.error, fontWeight: '700' as const }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.scoreDisplay, { borderColor: colors.tint }]}>
              <Sparkles size={20} color={colors.tint} />
              <Text style={[styles.scoreNumber, { color: colors.tint }]}>{score}</Text>
              {highScore > 0 && (
                <>
                  <View style={{ width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: 4 }} />
                  <Trophy size={18} color={colors.warning} />
                  <Text style={[styles.scoreNumber, { fontSize: 18, color: colors.warning }]}>{highScore}</Text>
                </>
              )}
            </View>

            <View style={styles.gameContainer}>
              {bubbles.map(bubble => {
          const translateY = bubble.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -gameHeight - bubble.size],
          });

          const wobble = bubble.animValue.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, 15, -10, 10, -5],
          });

          const scale = bubble.animValue.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [0, 1, 0.95],
          });

          return (
            <Animated.View
              key={bubble.id}
              style={[
                styles.bubble,
                {
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.x,
                  bottom: 60,
                  transform: [
                    { translateY },
                    { translateX: wobble },
                    { scale },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleBubblePop(bubble.id)}
                style={[styles.bubbleInner, { backgroundColor: bubble.color }]}
                activeOpacity={0.7}
              >
                <View style={styles.bubbleHighlight} />
              </TouchableOpacity>
            </Animated.View>
              );
              })}
            </View>

            {gameOver && (
              <Animated.View
                style={[
                  styles.gameOverOverlay,
                  {
                    transform: [{ scale: gameOverScaleAnim }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.gameOverCard,
                    { borderColor: colors.tint, transform: [{ scale: gameOverBounce }] },
                  ]}
                >
                  <View style={[styles.gameOverIcon, { backgroundColor: colors.tint }]}>
                    <Trophy size={40} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.gameOverTitle, { color: colors.tint }]}>Game Over!</Text>
                  <Text style={[styles.gameOverScore, { color: colors.text }]}>
                    Score: {score} {score > highScore && '🎉'}
                  </Text>
                  {score > highScore && (
                    <Text style={[styles.gameOverScore, { color: colors.warning, fontSize: 16 }]}>New High Score! 🏆</Text>
                  )}
                  <View style={{ flexDirection: 'row' as const, gap: 12, marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={handleRestart}
                      style={[styles.gameOverButton, { backgroundColor: colors.tint, borderColor: colors.tint }]}
                      activeOpacity={0.8}
                    >
                      <Zap size={20} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={[styles.gameOverButtonText, { color: '#FFFFFF' }]}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={[styles.gameOverButton, { backgroundColor: 'transparent', borderColor: colors.border }]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.gameOverButtonText, { color: colors.text }]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
