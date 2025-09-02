"use client";

import { MapPin, Navigation } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Button from "./ui/Button";

interface LocationUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  distance: number;
  source: "gps" | "network" | "manual";
  updateDirection?: "toReal" | "toManual";
}

export default function LocationUpdateDialog({
  isOpen,
  onClose,
  onConfirm,
  distance,
  source,
  updateDirection,
}: LocationUpdateDialogProps) {
  const sourceText = source === "gps" ? "GPS" : source === "network" ? "網路" : "手動設定";
  const SourceIcon = source === "gps" ? Navigation : source === "network" ? MapPin : MapPin;
  
  // 根據更新方向生成不同的描述文字
  const getUpdateDescription = () => {
    if (updateDirection === "toManual") {
      return "建議切換到手動設定的位置（更接近您的實際位置）";
    } else if (updateDirection === "toReal") {
      return "建議切換到最近的實際位置（更準確的 GPS 定位）";
    } else {
      return "偵測到更準確的位置";
    }
  };

  const getActionButtonText = () => {
    if (updateDirection === "toManual") {
      return "切換到手動設定";
    } else if (updateDirection === "toReal") {
      return "切換到實際位置";
    } else {
      return "切換位置";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <SourceIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle>位置更新建議</DialogTitle>
              <DialogDescription>{getUpdateDescription()}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 mb-4">
            偵測到您的位置與當前設定相差{" "}
            <span className="font-semibold text-orange-600">{distance} 公里</span>
            ，是否要切換到更準確的位置？
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-orange-700">
              <SourceIcon className="w-4 h-4" />
              <span>來源：{sourceText}</span>
            </div>
            {updateDirection && (
              <div className="mt-2 text-xs text-orange-600">
                {updateDirection === "toManual" 
                  ? "🔄 建議切換到手動設定位置" 
                  : "📍 建議切換到實際 GPS 位置"
                }
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            保持原設定
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
          >
            {getActionButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
