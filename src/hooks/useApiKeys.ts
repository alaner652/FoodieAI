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

  // Get effective API keys (user-provided keys only, server has fallback)
  const getEffectiveApiKeys = useCallback((): ApiKeys => {
    return {
      google: apiKeys.google || "",
      gemini: apiKeys.gemini || "",
    };
  }, [apiKeys]);

  const updateApiKey = useCallback((type: keyof ApiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [type]: value }));
    localStorage.setItem(
      `user${type.charAt(0).toUpperCase() + type.slice(1)}ApiKey`,
      value
    );
  }, []);

  const validateApiKeys = useCallback(() => {
    // Note: Server-side has fallback keys, so validation is more lenient
    // Users can optionally provide their own keys for better rate limits
    return { isValid: true, error: "" };
  }, []);

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
