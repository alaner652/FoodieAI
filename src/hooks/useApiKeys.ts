import { useCallback, useState } from "react";

interface ApiKeys {
  google: string;
  gemini: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    // Safely check if localStorage is available (SSR safe)
    if (typeof window !== "undefined") {
      return {
        google: localStorage.getItem("userGoogleApiKey") || "",
        gemini: localStorage.getItem("userGeminiKey") || "",
      };
    }
    return { google: "", gemini: "" };
  });

  // Get effective API keys with fallback to environment variables
  const getEffectiveApiKeys = useCallback((): ApiKeys => {
    return {
      google:
        apiKeys.google || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
      gemini: apiKeys.gemini || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    };
  }, [apiKeys]);

  const updateApiKey = useCallback((type: keyof ApiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [type]: value }));
    localStorage.setItem(
      `user${type.charAt(0).toUpperCase() + type.slice(1)}ApiKey`,
      value
    );
  }, []);

  const validateApiKeys = useCallback(
    (requiredKeys: (keyof ApiKeys)[] = ["google", "gemini"]) => {
      const effectiveKeys = getEffectiveApiKeys();
      const missingKeys = requiredKeys.filter(
        (key) => !effectiveKeys[key].trim()
      );

      if (missingKeys.length > 0) {
        const keyNames = {
          google: "Google Places API Key",
          gemini: "Gemini API Key",
        };

        const missingKeyNames = missingKeys
          .map((key) => keyNames[key])
          .join("、");
        return {
          isValid: false,
          error: `請先設定您的 ${missingKeyNames}，前往測試頁面進行設定。`,
        };
      }

      return { isValid: true, error: "" };
    },
    [getEffectiveApiKeys]
  );

  const getApiKeys = useCallback(
    () => getEffectiveApiKeys(),
    [getEffectiveApiKeys]
  );

  return {
    apiKeys, // 原始用戶設定的 keys (用於 UI 顯示)
    effectiveApiKeys: getEffectiveApiKeys(), // 實際使用的 keys (包含 fallback)
    updateApiKey,
    validateApiKeys,
    getApiKeys, // 返回實際使用的 keys
    getEffectiveApiKeys,
  };
};
