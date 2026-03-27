import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, ArrowRight, PartyPopper, Sparkles, Zap } from 'lucide-react-native';
import { hapticFeedback } from '@/utils/haptics';
import { useRouter } from 'expo-router';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type QuestionType = 'input' | 'options';

interface Question {
  question: string;
  questionAr: string;
  type: QuestionType;
  key: string;
  options?: string[];
  optionsAr?: string[];
  placeholder?: string;
  placeholderAr?: string;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [savedDays, setSavedDays] = useState<number>(0);
  const [localLogoFailed, setLocalLogoFailed] = useState<boolean>(false);
  const [remoteLogoFailed, setRemoteLogoFailed] = useState<boolean>(false);

  const remoteLogoUrl =
    'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q';

  const resultsScaleAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const letterAnimations = useRef(
    Array.from({ length: 7 }).map(() => new Animated.Value(0))
  ).current;

  const questions: Question[] = useMemo(
    () => [
      {
        question: 'How many hours per week do you spend ironing?',
        questionAr: 'كم ساعة أسبوعيًا تقضيها في الكي؟',
        type: 'input',
        key: 'hours',
        placeholder: 'Enter number of hours…',
        placeholderAr: 'أدخل عدد الساعات…',
      },
      {
        question: 'What garment do you hate ironing the most?',
        questionAr: 'ما أكثر قطعة تكره كيها؟',
        type: 'options',
        options: ['Suit', 'Shirt', 'Silk Dress', 'Pants'],
        optionsAr: ['بدلة', 'قميص', 'فستان حرير', 'بنطلون'],
        key: 'hatedItem',
      },
      {
        question: 'Have you faced an ironing emergency before an important meeting?',
        questionAr: 'هل واجهت أزمة كي طارئة قبل مقابلة أو موعد مهم؟',
        type: 'options',
        options: ['Yes', 'No'],
        optionsAr: ['نعم', 'لا'],
        key: 'emergency',
      },
    ],
    []
  );

  const isComplete = useMemo(() => {
    return questions.every((q) => (answers[q.key] ?? '').trim().length > 0);
  }, [answers, questions]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const staggerDelay = 100;
    const animations = letterAnimations.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        delay: 300 + index * staggerDelay,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, animations).start();
  }, [logoScaleAnim, logoFadeAnim, letterAnimations]);

  useEffect(() => {
    if (showResults) {
      resultsScaleAnim.setValue(0);
      Animated.spring(resultsScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [showResults, resultsScaleAnim]);

  const handleSkip = useCallback(async () => {
    await hapticFeedback.light();
    onComplete();
  }, [onComplete]);

  const handleInputBlur = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleTextInputSubmit = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleAnswerInput = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAnswerOption = useCallback((key: string, option: string) => {
    hapticFeedback.light();
    setAnswers((prev) => ({ ...prev, [key]: option }));
  }, []);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();
    await hapticFeedback.medium();

    const hours = parseInt((answers['hours'] ?? '0').trim(), 10);
    const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 0;
    const calculatedDays = Math.round((safeHours * 52) / 24);

    console.log('[Onboarding] Submit', {
      answers,
      parsedHours: hours,
      safeHours,
      calculatedDays,
    });

    setSavedDays(calculatedDays);
    setShowResults(true);
    await hapticFeedback.success();
  }, [answers]);

  const renderQuestion = useCallback(
    (q: Question) => {
      const value = answers[q.key] ?? '';

      if (q.type === 'input') {
        return (
          <View style={styles.questionCard} testID={`onboarding-question-${q.key}`}>
            <Text style={styles.questionTitle}>{q.question}</Text>
            <Text style={styles.questionSubtitle}>{q.questionAr}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={q.placeholder}
                placeholderTextColor="#64748B"
                value={value}
                onChangeText={(t) => handleAnswerInput(q.key, t)}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleTextInputSubmit}
                onBlur={handleInputBlur}
                blurOnSubmit={true}
                testID={`onboarding-input-${q.key}`}
              />
            </View>
          </View>
        );
      }

      return (
        <View style={styles.questionCard} testID={`onboarding-question-${q.key}`}>
          <Text style={styles.questionTitle}>{q.question}</Text>
          <Text style={styles.questionSubtitle}>{q.questionAr}</Text>

          <View style={styles.optionsRow} testID={`onboarding-options-${q.key}`}>
            {q.options?.map((option, index) => {
              const isSelected = value === option;
              return (
                <TouchableOpacity
                  key={`${q.key}-${index}`}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                  onPress={() => handleAnswerOption(q.key, option)}
                  activeOpacity={0.75}
                  testID={`onboarding-option-${q.key}-${index}`}
                >
                  <LinearGradient
                    colors={isSelected ? ['#10B981', '#059669'] : ['#111827', '#0B1220']}
                    style={styles.optionChipGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.optionChipText}>{option}</Text>
                    {isSelected ? (
                      <CheckCircle size={18} color="#FFFFFF" strokeWidth={2.5} />
                    ) : null}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    },
    [answers, handleAnswerInput, handleAnswerOption, handleInputBlur, handleTextInputSubmit]
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.background} />

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} testID="onboarding-skip">
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          testID="onboarding-scroll"
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoFadeAnim,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            <View style={styles.logoBrandWrapper}>
              <View style={styles.logoImageWrapper} testID="onboarding-logo-wrapper">
                {!localLogoFailed ? (
                  <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                    accessibilityLabel="Kaweely logo"
                    testID="onboarding-logo"
                    onError={(e) => {
                      console.log(
                        '[Onboarding] Local logo failed to load:',
                        e.nativeEvent?.error || 'Unknown error'
                      );
                      setLocalLogoFailed(true);
                    }}
                  />
                ) : !remoteLogoFailed ? (
                  <Image
                    source={{ uri: remoteLogoUrl }}
                    style={styles.logoImage}
                    resizeMode="contain"
                    accessibilityLabel="Kaweely logo"
                    testID="onboarding-logo-remote"
                    onError={(e) => {
                      console.log(
                        '[Onboarding] Remote logo failed to load:',
                        e.nativeEvent?.error || 'Unknown error'
                      );
                      setRemoteLogoFailed(true);
                    }}
                  />
                ) : (
                  <View style={styles.logoFallback} testID="onboarding-logo-fallback">
                    <Text style={styles.logoFallbackText}>K</Text>
                  </View>
                )}
              </View>

              <Text style={styles.welcomeText}>Welcome</Text>

              <View style={styles.logoTextContainer}>
                {['K', 'a', 'w', 'e', 'e', 'l', 'y'].map((letter, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [
                        {
                          translateY: letterAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          }),
                        },
                        { scale: letterAnimations[index] },
                      ],
                      opacity: letterAnimations[index],
                    }}
                  >
                    <LinearGradient
                      colors={['#10B981', '#34D399', '#6EE7B7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.letterGradient}
                    >
                      <Text style={styles.logoLetter}>{letter}</Text>
                    </LinearGradient>
                  </Animated.View>
                ))}
              </View>

              <Animated.View style={[styles.brandContainer, { opacity: logoFadeAnim }]}>
                <View style={styles.divider} />
                <Text style={styles.logoTagline}>Professional Ironing Service</Text>
              </Animated.View>
            </View>
          </Animated.View>

          <View style={styles.headerCopy} testID="onboarding-header-copy">
            <Text style={styles.headerTitle}>Quick questions</Text>
            <Text style={styles.headerSubtitle}>Answer once — and you’re ready to start.</Text>
          </View>

          <View style={styles.questionsContainer} testID="onboarding-questions">
            {questions.map((q) => (
              <View key={q.key}>{renderQuestion(q)}</View>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={!isComplete}
              testID="onboarding-submit"
            >
              <LinearGradient
                colors={isComplete ? ['#10B981', '#059669'] : ['#374151', '#1F2937']}
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryButtonText}>Finish</Text>
                <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerHint}>
              You can skip this anytime — it just helps personalize your experience.
            </Text>
          </View>
        </ScrollView>

        <Modal
          visible={showResults}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowResults(false);
            onComplete();
          }}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.resultsContainer,
                {
                  transform: [{ scale: resultsScaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.resultsGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.resultsIconContainer}>
                  <PartyPopper size={60} color="#FFFFFF" strokeWidth={2.5} />
                </View>

                <Text style={styles.resultsTitle}>All set!</Text>
                <Text style={styles.resultsTitleAr}>جاهز!</Text>

                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsNumber}>{savedDays}</Text>
                  <Text style={styles.savingsLabel}>Days saved per year</Text>
                  <Text style={styles.savingsLabelAr}>يومًا سنويًا من وقتك!</Text>
                </View>

                <Text style={styles.resultsDescription}>
                  We’ll save you {savedDays} days annually by handling your ironing.
                </Text>

                <View style={styles.subscriptionPreview}>
                  <View style={styles.previewHeader}>
                    <Sparkles size={20} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                    <Text style={styles.previewTitle}>Want even more time back?</Text>
                  </View>
                  <Text style={styles.previewSubtitle}>
                    Pick a plan and let Kaweely handle the rest.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => {
                    setShowResults(false);
                    hapticFeedback.success();
                    onComplete();
                    setTimeout(() => {
                      router.push('/(tabs)/subscribe');
                    }, 150);
                  }}
                  activeOpacity={0.8}
                  testID="onboarding-view-subscriptions"
                >
                  <View style={styles.subscribeButtonInner}>
                    <Text style={styles.subscribeButtonText}>View Subscription Plans</Text>
                    <Zap size={20} color="#10B981" strokeWidth={2.5} fill="#10B981" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipSubscribeButton}
                  onPress={() => {
                    setShowResults(false);
                    hapticFeedback.light();
                    onComplete();
                  }}
                  activeOpacity={0.8}
                  testID="onboarding-results-close"
                >
                  <Text style={styles.skipSubscribeText}>Continue</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 42,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 18,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 999,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.2,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 86,
    marginBottom: 18,
  },
  logoBrandWrapper: {
    alignItems: 'center',
  },
  logoImageWrapper: {
    width: 62,
    height: 62,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 46,
    height: 46,
  },
  logoFallback: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallbackText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.8,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  letterGradient: {
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  logoLetter: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(16, 185, 129, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  brandContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginBottom: 10,
  },
  logoTagline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  headerCopy: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    lineHeight: 20,
  },
  questionsContainer: {
    paddingHorizontal: 18,
    gap: 14,
  },
  questionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 18,
    padding: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  questionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.9)',
    lineHeight: 18,
  },
  inputContainer: {
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
  },
  optionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  optionChipSelected: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  optionChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  primaryButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  footerHint: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  resultsContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  resultsGradient: {
    padding: 40,
    alignItems: 'center',
  },
  resultsIconContainer: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultsTitleAr: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  savingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  savingsNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  savingsLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  savingsLabelAr: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultsDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  subscriptionPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  previewSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFFDD',
    textAlign: 'center',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonInner: {
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.3,
  },
  skipSubscribeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  skipSubscribeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFFEE',
    textAlign: 'center',
  },
});
