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
  source: "gps" | "network";
}

export default function LocationUpdateDialog({
  isOpen,
  onClose,
  onConfirm,
  distance,
  source,
}: LocationUpdateDialogProps) {
  const sourceText = source === "gps" ? "GPS" : "網路";
  const SourceIcon = source === "gps" ? Navigation : MapPin;

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
              <DialogDescription>偵測到更準確的位置</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 mb-4">
            偵測到您的位置與手動設定相差{" "}
            <span className="font-semibold text-orange-600">{distance} 公里</span>
            ，是否要切換到更準確的{sourceText}位置？
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-orange-700">
              <SourceIcon className="w-4 h-4" />
              <span>來源：{sourceText}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            保持原設定
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
          >
            切換位置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
