import { useToastContext } from "@/contexts/ToastContext";
import { DEV_CONFIG, UI_CONFIG } from "@/lib/config";
import { Restaurant } from "@/types";
import { useCallback, useState } from "react";

interface RecommendationState {
  recommendations: Restaurant[];
  showResults: boolean;
  aiReason: string;
  aiRecommendedCount: number;
  isLoading: boolean;
  isRandomLoading: boolean;
  error: string;
}

export const useRecommendations = () => {
  const { showError, showSuccess } = useToastContext();
  const [state, setState] = useState<RecommendationState>({
    recommendations: [],
    showResults: false,
    aiReason: "",
    aiRecommendedCount: 0,
    isLoading: false,
    isRandomLoading: false,
    error: "",
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const handleSubmit = useCallback(
    async (params: {
      userInput: string;
      latitude: number;
      longitude: number;
      radius: number;
      userGoogleApiKey: string;
      userGeminiApiKey: string;
    }) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        showResults: false,
        error: "",
      }));

      try {
        const response = await fetch(DEV_CONFIG.ENDPOINTS.RECOMMEND, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInput: params.userInput.trim() || "",
            latitude: params.latitude,
            longitude: params.longitude,
            radius: params.radius,
            userGoogleApiKey: params.userGoogleApiKey,
            userGeminiApiKey: params.userGeminiApiKey,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setState((prev) => ({
            ...prev,
            recommendations: result.data.recommendations,
            aiReason: result.data.aiReason || "",
            aiRecommendedCount: result.data.aiRecommendedCount || 0,
            showResults: true,
            error: result.data.noResultsFound ? "" : prev.error,
          }));

          // Show success toast
          const count = result.data.recommendations?.length || 0;
          if (count > 0) {
            showSuccess(`為您找到 ${count} 家完美餐廳！`, "AI 推薦");
          }
        } else {
          const errorMessage = getErrorMessage(result.error);
          setState((prev) => ({ ...prev, error: errorMessage }));
          showError(errorMessage, "推薦失敗");
          console.error("Recommendation failed:", result.error);
        }
      } catch (error) {
        let errorMessage: string;

        if (error instanceof Error) {
          // Handle JSON parsing errors
          if (
            error.message.includes("JSON") ||
            error.message.includes("Unexpected token")
          ) {
            errorMessage = "服務器回應格式錯誤，請稍後再試";
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = UI_CONFIG.ERROR_MESSAGES.API_FAILED;
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        showError(errorMessage, "網路錯誤");
        console.error("Recommendation failed:", error);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [showError, showSuccess]
  );

  const handleRandomRestaurants = useCallback(
    async (params: {
      latitude: number;
      longitude: number;
      radius: number;
      userGoogleApiKey: string;
    }) => {
      setState((prev) => ({
        ...prev,
        isRandomLoading: true,
        error: "",
        showResults: false,
      }));

      try {
        const response = await fetch("/api/random", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: params.latitude,
            longitude: params.longitude,
            radius: params.radius,
            count: 4,
            userGoogleApiKey: params.userGoogleApiKey,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setState((prev) => ({
            ...prev,
            recommendations: result.data.restaurants,
            aiReason: "隨機餐廳選擇，無特定偏好分析。",
            aiRecommendedCount: result.data.totalFound,
            showResults: true,
          }));

          // Show success toast
          const count = result.data.restaurants?.length || 0;
          if (count > 0) {
            showSuccess(`為您找到 ${count} 家隨機餐廳！`, "隨機選擇");
          }
        } else {
          const errorMsg = result.error || "Random selection failed";
          setState((prev) => ({
            ...prev,
            error: errorMsg,
          }));
          showError(errorMsg, "隨機選擇失敗");
        }
      } catch (error) {
        let errorMessage: string;

        if (error instanceof Error) {
          // Handle JSON parsing errors
          if (
            error.message.includes("JSON") ||
            error.message.includes("Unexpected token")
          ) {
            errorMessage = "服務器回應格式錯誤，請稍後再試";
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "隨機選擇失敗，請稍後再試";
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        showError(errorMessage, "隨機選擇錯誤");
        console.error("Random selection failed:", error);
      } finally {
        setState((prev) => ({ ...prev, isRandomLoading: false }));
      }
    },
    [showError, showSuccess]
  );

  const handleRandomPick = useCallback(() => {
    if (state.recommendations.length === 0) return;
    const shuffled = [...state.recommendations].sort(() => Math.random() - 0.5);
    const selected = shuffled[0];
    setState((prev) => ({
      ...prev,
      recommendations: [selected],
    }));

    // Show success toast
    showSuccess(`隨機選擇：${selected.name}！`, "隨機挑選");
  }, [state.recommendations, showSuccess]);

  const getErrorMessage = (error: string): string => {
    if (error.includes("API")) return "推薦系統暫時無法使用，請稍後再試";
    if (error.includes("userInput")) return "搜尋條件格式錯誤，請重新輸入";
    if (error.includes("latitude") || error.includes("longitude"))
      return "位置資訊錯誤，請重新定位";
    if (error.includes("radius")) return "搜尋範圍設定錯誤，請調整範圍";
    return error;
  };

  return {
    ...state,
    handleSubmit,
    handleRandomRestaurants,
    handleRandomPick,
    clearError,
    setError,
  };
};
