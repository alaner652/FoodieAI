# UI 組件庫

這是一個可重用的 UI 組件庫，提供了常用的界面元素，讓網站更容易維護和擴展。

## 組件列表

### Button 按鈕組件

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="lg" loading={isLoading}>
  點擊我
</Button>;
```

**Props:**

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg" | "xl"
- `loading`: boolean - 是否顯示載入狀態
- `icon`: React.ComponentType - 左側圖示
- `disabled`: boolean - 是否禁用

### Input 輸入框組件

```tsx
import { Input } from "@/components/ui";

<Input
  label="搜尋"
  placeholder="輸入搜尋內容..."
  leftIcon={Search}
  error={errorMessage}
/>;
```

**Props:**

- `label`: string - 標籤文字
- `error`: string - 錯誤訊息
- `leftIcon`: React.ComponentType - 左側圖示
- `rightIcon`: React.ComponentType - 右側圖示
- `onRightIconClick`: () => void - 右側圖示點擊事件

### Card 卡片組件

```tsx
import { Card } from "@/components/ui";

<Card variant="elevated" padding="lg">
  卡片內容
</Card>;
```

**Props:**

- `variant`: "default" | "outlined" | "elevated"
- `padding`: "none" | "sm" | "md" | "lg" | "xl"

### Alert 提示組件

```tsx
import { Alert } from "@/components/ui";

<Alert variant="warning" title="注意">
  這是一個警告提示
</Alert>;
```

**Props:**

- `variant`: "info" | "success" | "warning" | "error"
- `title`: string - 標題文字
- `onClose`: () => void - 關閉事件

### Badge 標籤組件

```tsx
import { Badge } from "@/components/ui";

<Badge variant="primary" size="md">
  新功能
</Badge>;
```

**Props:**

- `variant`: "default" | "primary" | "secondary" | "success" | "warning" | "error"
- `size`: "sm" | "md" | "lg"

### Container 容器組件

```tsx
import { Container } from "@/components/ui";

<Container maxWidth="4xl" center>
  容器內容
</Container>;
```

**Props:**

- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
- `center`: boolean - 是否置中

## 使用方式

### 1. 導入組件

```tsx
import { Button, Input, Card, Alert, Badge, Container } from "@/components/ui";
```

### 2. 使用組件

```tsx
<Container maxWidth="4xl">
  <Card padding="lg">
    <h2>標題</h2>
    <Input label="名稱" placeholder="輸入名稱..." />
    <Button variant="primary" size="lg">
      提交
    </Button>
  </Card>
</Container>
```

### 3. 自定義樣式

```tsx
<Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
  自定義按鈕
</Button>
```

## 設計原則

1. **一致性**: 所有組件使用統一的設計語言和間距系統
2. **可擴展性**: 組件支持自定義樣式和行為
3. **可訪問性**: 組件包含適當的 ARIA 屬性和鍵盤導航支持
4. **響應式**: 組件在不同螢幕尺寸下都有良好的表現
5. **TypeScript**: 完整的類型定義，提供開發時的類型安全

## 維護指南

### 添加新組件

1. 在 `src/components/ui/` 目錄下創建新的組件文件
2. 使用 TypeScript 定義 Props 介面
3. 使用 `forwardRef` 支持 ref 傳遞
4. 在 `index.ts` 中導出新組件
5. 更新 README 文檔

### 修改現有組件

1. 保持向後兼容性
2. 更新 TypeScript 類型定義
3. 更新 README 文檔
4. 測試組件在不同場景下的表現

### 樣式指南

1. 使用 Tailwind CSS 類名
2. 遵循設計系統的間距和顏色規範
3. 支持深色模式（如果需要的話）
4. 確保組件在不同主題下的一致性
