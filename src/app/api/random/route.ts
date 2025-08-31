import { getRandomRestaurants } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      latitude,
      longitude,
      radius,
      count = 4,
      userGoogleApiKey,
    } = await request.json();

    // 驗證必要參數
    if (!latitude || !longitude || !userGoogleApiKey) {
      return NextResponse.json(
        { success: false, error: "缺少必要參數" },
        { status: 400 }
      );
    }

    // 驗證半徑範圍
    if (radius < 200 || radius > 5000) {
      return NextResponse.json(
        { success: false, error: "搜尋半徑必須在 200m - 5000m 之間" },
        { status: 400 }
      );
    }

    // 驗證數量範圍
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { success: false, error: "餐廳數量必須在 1-10 之間" },
        { status: 400 }
      );
    }

    // 獲取隨機餐廳
    const restaurants = await getRandomRestaurants({
      latitude,
      longitude,
      radius,
      count,
      userApiKey: userGoogleApiKey,
    });

    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "在指定範圍內沒有找到餐廳",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurants,
        totalFound: restaurants.length,
        searchRadius: radius,
        searchLocation: { latitude, longitude },
      },
    });
  } catch (error) {
    console.error("隨機餐廳選擇失敗:", error);
    return NextResponse.json(
      {
        success: false,
        error: "隨機餐廳選擇失敗，請稍後再試",
      },
      { status: 500 }
    );
  }
}
