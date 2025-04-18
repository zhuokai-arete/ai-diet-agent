'use client';

import React, { useState } from 'react';

interface FeedbackFormProps {
  onComplete: (data: any) => void;
}

export default function FeedbackForm({ onComplete }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) return; // 如果没有评分，不提交
    
    setIsSubmitting(true);
    
    // 添加延迟模拟处理数据
    setTimeout(() => {
      // 将前端评分转换为后端需要的格式
      const feedbackScores = {
        satisfaction_score: rating / 5, // 将1-5的评分转换为0-1
        health_score: 0.5, // 默认值
        calorie_score: 0.5, // 默认值
        satiety_score: 0.5, // 默认值
        feedback_comment: feedback // 添加反馈评论
      };
      
      onComplete(feedbackScores);
      setIsSubmitting(false);
    }, 500);
  };

  console.log("Current rating:", rating); // 用于调试

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">分享您的反馈</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-lg font-medium text-gray-800 mb-4">
          您对营养推荐的满意度如何？
        </label>
        <div className="flex justify-between space-x-2 sm:space-x-4 mb-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                rating === value
                  ? 'bg-indigo-600 text-white shadow-md transform -translate-y-1'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2 px-2">
          <span>不满意</span>
          <span>非常满意</span>
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="feedback" className="block text-lg font-medium text-gray-800 mb-3">
          补充反馈
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="请分享您对推荐内容的想法..."
          className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
        />
      </div>

      <div className="flex justify-end mt-10">
        <button
          type="submit"
          disabled={!rating || isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? "提交中..." : "提交反馈"}
        </button>
      </div>
    </form>
  );
} 