import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { VoiceCommand, VoiceCommandResult, CommandSuggestion } from "@/types/voiceCommand";
import { useCart } from "./CartContext";
import { useWallet } from "./WalletContext";
import { hapticFeedback } from "@/utils/haptics";

interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const [VoiceCommandProvider, useVoiceCommand] = createContextHook(() => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<WebSpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { balance } = useWallet();

  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const available = await Speech.isSpeakingAsync();
      if (available) {
        await Speech.stop();
      }
      
      await Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.95,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  }, []);

  const parseCommand = useCallback((text: string): VoiceCommand => {
    const lowerText = text.toLowerCase().trim();

    if (lowerText.includes("home") || lowerText.includes("go home")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/" },
        confidence: 0.95,
        transcript: text,
      };
    }

    if (lowerText.includes("order") && (lowerText.includes("new") || lowerText.includes("create") || lowerText.includes("place"))) {
      return {
        type: "order",
        action: "create",
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("show") && lowerText.includes("order")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/(tabs)/orders" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("track") || lowerText.includes("tracking")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/(tabs)/tracking" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("cart") || lowerText.includes("basket")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/cart" },
        confidence: 0.95,
        transcript: text,
      };
    }

    if (lowerText.includes("wallet") || lowerText.includes("balance")) {
      return {
        type: "wallet",
        action: "check_balance",
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("add money") || lowerText.includes("top up")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/add-money" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("reward") || lowerText.includes("point")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/rewards" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("profile") || lowerText.includes("account")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/(tabs)/profile" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("subscribe") || lowerText.includes("subscription")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/(tabs)/subscribe" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("support") || lowerText.includes("help")) {
      return {
        type: "action",
        action: "contact_support",
        confidence: 0.85,
        transcript: text,
      };
    }

    if (lowerText.includes("clear") && lowerText.includes("cart")) {
      return {
        type: "cart",
        action: "clear",
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("cancel") && lowerText.includes("order")) {
      return {
        type: "order",
        action: "cancel",
        confidence: 0.85,
        transcript: text,
      };
    }

    if (lowerText.includes("store") || lowerText.includes("shop")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/store" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("price") || lowerText.includes("calculator")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/price-calculator" },
        confidence: 0.9,
        transcript: text,
      };
    }

    if (lowerText.includes("eco") || lowerText.includes("impact") || lowerText.includes("sustainability")) {
      return {
        type: "navigation",
        action: "navigate",
        params: { screen: "/eco-impact" },
        confidence: 0.85,
        transcript: text,
      };
    }

    return {
      type: "unknown",
      action: "unknown",
      confidence: 0,
      transcript: text,
    };
  }, []);

  const executeCommand = useCallback(async (command: VoiceCommand): Promise<VoiceCommandResult> => {
    try {
      hapticFeedback.medium();
      
      switch (command.type) {
        case "navigation":
          if (command.params?.screen) {
            router.push(command.params.screen as any);
            const screenName = command.params.screen.split("/").pop() || "screen";
            await speak(`Navigating to ${screenName}`);
            return {
              success: true,
              message: `Navigated to ${screenName}`,
            };
          }
          break;

        case "wallet":
          if (command.action === "check_balance") {
            await speak(`Your wallet balance is ${balance.toFixed(2)} Egyptian Pounds`);
            return {
              success: true,
              message: `Balance: ${balance.toFixed(2)} EGP`,
              data: { balance },
            };
          }
          break;

        case "cart":
          if (command.action === "clear") {
            clearCart();
            await speak("Cart cleared successfully");
            return {
              success: true,
              message: "Cart cleared",
            };
          }
          break;

        case "order":
          if (command.action === "create") {
            if (cartItems.length === 0) {
              await speak("Your cart is empty. Add items first.");
              return {
                success: false,
                message: "Cart is empty",
              };
            }
            router.push("/cart");
            await speak(`You have ${cartItems.length} items in cart for ${totalPrice.toFixed(2)} Egyptian Pounds. Opening cart.`);
            return {
              success: true,
              message: "Opening cart to complete order",
            };
          }
          break;

        case "action":
          if (command.action === "contact_support") {
            await speak("Opening support chat");
            return {
              success: true,
              message: "Contacting support",
            };
          }
          break;
      }

      await speak("I'm not sure how to help with that. Try saying 'show help' for available commands.");
      return {
        success: false,
        message: "Command not recognized",
      };
    } catch (error) {
      console.error("Command execution error:", error);
      await speak("Sorry, something went wrong. Please try again.");
      return {
        success: false,
        message: "Execution failed",
      };
    }
  }, [balance, cartItems, totalPrice, clearCart, speak]);

  const processCommand = useCallback(async (text: string) => {
    setIsProcessing(true);
    const command = parseCommand(text);
    setLastCommand(command);

    if (command.confidence < 0.7) {
      await speak("I'm not sure I understood that. Could you please repeat?");
      setIsProcessing(false);
      return;
    }

    await executeCommand(command);
    setIsProcessing(false);
  }, [parseCommand, executeCommand, speak]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition() as WebSpeechRecognition;
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          processCommand(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          speak("Sorry, I couldn't understand that. Please try again.");
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [processCommand, speak]);

  const startListening = useCallback(async () => {
    try {
      hapticFeedback.light();
      setTranscript("");
      setIsListening(true);

      if (Platform.OS === "web") {
        if (recognition) {
          try {
            recognition.start();
            console.log("[Voice] Started web speech recognition");
          } catch (err) {
            console.error("[Voice] Failed to start recognition:", err);
            await speak("Please allow microphone access in your browser settings");
            setIsListening(false);
          }
        } else {
          console.warn("[Voice] Speech recognition not supported in this browser");
          await speak("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
          setIsListening(false);
        }
      } else {
        console.log("[Voice] Mobile device detected - voice input not available");
        setIsListening(false);
      }
    } catch (error) {
      console.error("[Voice] Error starting voice recognition:", error);
      await speak("Sorry, I couldn't start listening. Please try again.");
      setIsListening(false);
    }
  }, [recognition, speak]);

  const stopListening = useCallback(() => {
    if (recognition && Platform.OS === "web") {
      recognition.stop();
    }
    setIsListening(false);
    hapticFeedback.light();
  }, [recognition]);

  const cancelListening = useCallback(() => {
    if (recognition && Platform.OS === "web") {
      recognition.abort();
    }
    setIsListening(false);
    setTranscript("");
    hapticFeedback.light();
  }, [recognition]);

  const suggestions = useMemo<CommandSuggestion[]>(() => [
    { text: "Show my orders", description: "View all orders", category: "Navigation" },
    { text: "Create new order", description: "Start new order", category: "Orders" },
    { text: "Check my balance", description: "View wallet balance", category: "Wallet" },
    { text: "Add money", description: "Top up wallet", category: "Wallet" },
    { text: "Show my rewards", description: "View loyalty points", category: "Rewards" },
    { text: "Track delivery", description: "Track active orders", category: "Tracking" },
    { text: "Open cart", description: "View shopping cart", category: "Cart" },
    { text: "Clear cart", description: "Empty shopping cart", category: "Cart" },
    { text: "Go to profile", description: "View profile settings", category: "Navigation" },
    { text: "Contact support", description: "Get help", category: "Support" },
    { text: "Show subscription", description: "View plans", category: "Subscription" },
    { text: "Price calculator", description: "Calculate prices", category: "Tools" },
  ], []);

  const processTextCommand = useCallback(async (text: string) => {
    console.log("[Voice] Processing text command:", text);
    setTranscript(text);
    await processCommand(text);
  }, [processCommand]);

  const isVoiceAvailable = Platform.OS === "web" && (typeof window !== 'undefined') && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return useMemo(() => ({
    isListening,
    transcript,
    lastCommand,
    isProcessing,
    isSpeaking,
    isVoiceAvailable,
    startListening,
    stopListening,
    cancelListening,
    speak,
    processTextCommand,
    suggestions,
  }), [
    isListening,
    transcript,
    lastCommand,
    isProcessing,
    isSpeaking,
    isVoiceAvailable,
    startListening,
    stopListening,
    cancelListening,
    speak,
    processTextCommand,
    suggestions,
  ]);
});
