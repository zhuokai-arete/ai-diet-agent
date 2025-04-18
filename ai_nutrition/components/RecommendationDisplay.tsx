'use client';

import React, { useState, useEffect } from 'react';

interface RecommendationDisplayProps {
  userInfo: any;
  goal: any;
  onComplete: (data: any) => void;
}

export default function RecommendationDisplay({ userInfo, goal, onComplete }: RecommendationDisplayProps) {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 辅助函数：将活动水平转换为分数
  const getActivityLevelScore = (level: string): number => {
    switch(level) {
      case "sedentary": return 1;
      case "light": return 2;
      case "moderate": return 3;
      case "very": return 4;
      case "extra": return 5;
      default: return 3;
    }
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        
        // 构建用户信息对象，匹配后端API格式
        const userProfile = {
          "性别": userInfo.gender === "male" ? "男" : "女",
          "年龄": parseInt(userInfo.age),
          "体重": parseFloat(userInfo.weight),
          "身高": parseFloat(userInfo.height),
          "运动频率": getActivityLevelScore(userInfo.activityLevel),
          "是否重视吃": userInfo.appetiteLevel === "large" ? 1 : 0,
          "饮食习惯": userInfo.appetiteLevel === "small" ? "少食" : userInfo.appetiteLevel === "medium" ? "正常" : "多食",
          "偏好": `${userInfo.dietaryPreferences}${userInfo.foodAllergies ? `，禁忌：${userInfo.foodAllergies}` : ''}`,
          "需求": goal?.goal || 'health'
        };

        // 调用本地后端API
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userProfile,
            feedback_scores: null // 首次请求没有反馈
          })
        });

        if (!response.ok) {
          throw new Error('获取推荐失败');
        }

        const data = await response.json();
        
        // 检查meal_plan是否存在
        if (!data.meal_plan) {
          throw new Error('未收到有效的餐计划数据');
        }

        // 转换后端返回的数据格式为前端需要的格式
        const recommendationData = {
          dailyCalories: 1800, // 后端固定为1800千卡
          macronutrients: {
            protein: 30, // 后端固定为30%
            carbs: 40,   // 后端固定为40%
            fats: 30     // 后端固定为30%
          },
          recommendedFoods: [
            {
              category: "早餐",
              items: data.meal_plan.breakfast?.map((item: any) => `${item.zh_name} (${item.weight_g}g)`) || []
            },
            {
              category: "午餐",
              items: data.meal_plan.lunch?.map((item: any) => `${item.zh_name} (${item.weight_g}g)`) || []
            },
            {
              category: "晚餐",
              items: data.meal_plan.dinner?.map((item: any) => `${item.zh_name} (${item.weight_g}g)`) || []
            },
            {
              category: "零食",
              items: data.meal_plan.snack?.map((item: any) => `${item.zh_name} (${item.weight_g}g)`) || []
            }
          ],
          explanation: data.explanation || "基于您的个人情况定制的营养计划"
        };

        setRecommendation(recommendationData);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : '发生错误');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [userInfo, goal]);

  const handleContinue = () => {
    if (recommendation) {
      onComplete({ recommendation });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          重试
        </button>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">您的个性化营养计划</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">每日目标</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">每日卡路里</p>
              <p className="text-3xl font-bold text-indigo-600">{recommendation.dailyCalories} 千卡</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">宏量营养素比例</p>
              <div className="flex justify-between mt-2">
                <div className="text-center">
                  <p className="text-sm text-gray-600">蛋白质</p>
                  <p className="text-2xl font-semibold text-indigo-600">{recommendation.macronutrients.protein}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">碳水</p>
                  <p className="text-2xl font-semibold text-indigo-600">{recommendation.macronutrients.carbs}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">脂肪</p>
                  <p className="text-2xl font-semibold text-indigo-600">{recommendation.macronutrients.fats}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">推荐食物</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recommendation.recommendedFoods.map((meal: any) => (
              <div key={meal.category} className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 text-lg">{meal.category}</h4>
                <ul className="space-y-2">
                  {meal.items.map((item: string) => (
                    <li key={item} className="text-sm text-gray-600 flex items-center">
                      <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-medium text-gray-900 mb-3 border-b border-indigo-100 pb-2">推荐说明</h3>
          <p className="text-gray-700 leading-relaxed">{recommendation.explanation}</p>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleContinue}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            继续提供反馈
          </button>
        </div>
      </div>
    </div>
  );
} 