"use client";

import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { useEffect, useState } from "react";

interface LocationDistanceCheckerProps {
  autoCheck?: boolean; // 是否自動檢查
  checkInterval?: number; // 檢查間隔（毫秒）
}

export default function LocationDistanceChecker({
  autoCheck = true,
  checkInterval = 300000, // 預設 5 分鐘檢查一次
}: LocationDistanceCheckerProps) {
  const location = useLocation();
  const { showWarning } = useToastContext();
  const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);

  // 計算兩個位置之間的距離（公里）
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // 地球半徑（公里）
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 檢查位置距離
  const checkLocationDistance = async () => {
    // 如果沒有設定位置，不檢查
    if (!location.latitude || !location.longitude) {
      return;
    }

    // 如果瀏覽器不支援地理位置，不檢查
    if (!navigator.geolocation) {
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false, // 降低精確度要求，提高速度
            timeout: 10000,
            maximumAge: 300000, // 5分鐘內的位置資料可以重用
          });
        }
      );

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        position.coords.latitude,
        position.coords.longitude
      );

      // 只在距離超過 2 公里時提醒，避免太頻繁
      if (distance > 2.0) {
        showWarning(
          `您的位置與設定相距 ${distance.toFixed(
            1
          )} 公里，建議到設定頁面更新位置以獲得更準確的推薦`,
          "位置距離較遠",
          8000
        );
      }

      setLastCheckTime(Date.now());
    } catch (error) {
      // 靜默處理錯誤，不打擾用戶
      console.log("Location check failed (silent):", error);
    }
  };

  // 自動檢查邏輯
  useEffect(() => {
    if (!autoCheck) return;

    // 初始檢查（延遲 3 秒，避免頁面載入時太快觸發）
    const initialTimer = setTimeout(() => {
      checkLocationDistance();
    }, 3000);

    // 定期檢查
    const intervalTimer = setInterval(() => {
      checkLocationDistance();
    }, checkInterval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [autoCheck, checkInterval, location.latitude, location.longitude]);

  // 這個組件不渲染任何 UI，只是背景運行
  return null;
}
