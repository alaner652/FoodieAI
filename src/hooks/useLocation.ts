// 這個文件現在重新導出 LocationContext 中的 useLocation
// 保持向後兼容性，讓現有組件無需修改導入路徑

export {
  addLocationChangeListener,
  useLocation,
} from "@/contexts/LocationContext";
