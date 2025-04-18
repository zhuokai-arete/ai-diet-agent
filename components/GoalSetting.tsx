'use client';

import React, { useState } from 'react';

interface GoalSettingProps {
  onComplete: (data: any) => void;
}

export default function GoalSetting({ onComplete }: GoalSettingProps) {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const goals = [
    {
      id: 'health',
      title: '健康均衡',
      description: '通过科学饮食改善营养结构，维持身体机能，适用于日常健康管理或慢性病预防与辅助调理',
      icon: '❤️',
    },
    {
      id: 'performance',
      title: '运动强化',
      description: '以提升运动过程中的表现为目标，支持训练时的耐力、爆发力与恢复力，适合高强度运动习惯者。',
      icon: '🏃',
    },
    {
      id: 'muscle-gain',
      title: '增肌/塑形',
      description: '通过营养干预与训练配合，提升肌肉含量、优化身体线条，打造更紧致、有型的体态。',
      icon: '💪',
    },
    {
      id: 'fat-loss',
      title: '减脂',
      description: '以降低体脂率、减少体重为目标，热量赤字+低脂饮食为主',
      icon: '⚖️',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      goal: selectedGoal,
      additionalNotes,
      goalTitle: goals.find(g => g.id === selectedGoal)?.title || '健康均衡'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">选择您的营养目标</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`relative rounded-lg border p-6 cursor-pointer hover:border-indigo-500 transition-all duration-200 ${
              selectedGoal === goal.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-300'
            }`}
            onClick={() => setSelectedGoal(goal.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{goal.icon}</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
              </div>
            </div>
            {selectedGoal === goal.id && (
              <div className="absolute top-3 right-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
          补充说明
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={3}
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="您有什么特别的目标或考虑因素吗？"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={!selectedGoal}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          下一步
        </button>
      </div>
    </form>
  );
} 
