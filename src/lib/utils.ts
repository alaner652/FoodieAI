/**
 * 將價格範圍符號轉換為中文描述
 * @param priceRange 價格範圍符號 ($, $$, $$$, $$$$)
 * @returns 對應的中文描述
 */
export const getPriceRangeText = (priceRange: string): string => {
  switch (priceRange) {
    case "$":
      return "平價";
    case "$$":
      return "中等價位";
    case "$$$":
      return "高級價位";
    case "$$$$":
      return "奢華價位";
    default:
      return "中等價位";
  }
};
