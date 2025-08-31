import { useCallback, useState } from "react";

interface ApiKeys {
  google: string;
  gemini: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    // 安全地檢查 localStorage 是否可用（SSR 安全）
    if (typeof window !== "undefined") {
      return {
        google: localStorage.getItem("userGoogleApiKey") || "",
        gemini: localStorage.getItem("userGeminiKey") || "",
      };
    }
    return { google: "", gemini: "" };
  });

  const updateApiKey = useCallback((type: keyof ApiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [type]: value }));
    localStorage.setItem(
      `user${type.charAt(0).toUpperCase() + type.slice(1)}ApiKey`,
      value
    );
  }, []);

  const validateApiKeys = useCallback(
    (requiredKeys: (keyof ApiKeys)[] = ["google", "gemini"]) => {
      const missingKeys = requiredKeys.filter((key) => !apiKeys[key].trim());

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
    [apiKeys]
  );

  const getApiKeys = useCallback(() => apiKeys, [apiKeys]);

  return {
    apiKeys,
    updateApiKey,
    validateApiKeys,
    getApiKeys,
  };
};
