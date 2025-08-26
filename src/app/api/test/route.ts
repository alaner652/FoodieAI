import { searchNearbyRestaurants } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "1000";

    if (!lat || !lng) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少 lat 和 lng 參數",
          example: "/api/test?lat=25.0330&lng=121.5654&radius=1000",
        },
        { status: 400 }
      );
    }

    // 測試 Google Places API
    const restaurants = await searchNearbyRestaurants({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radius: parseInt(radius),
      openNow: false, // 測試時不限制營業時間
    });

    return NextResponse.json({
      success: true,
      data: {
        restaurants_count: restaurants.length,
        restaurants: restaurants.slice(0, 3), // 只回傳前 3 間作為範例
        search_params: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: parseInt(radius),
        },
      },
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知錯誤",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
