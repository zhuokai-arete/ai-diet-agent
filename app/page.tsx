'use client';

import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import GoalSetting from '../components/GoalSetting';
import RecommendationDisplay from '../components/RecommendationDisplay';
import FeedbackForm from '../components/FeedbackForm';

type Step = 'user-info' | 'goal-setting' | 'recommendation' | 'feedback' | 'complete';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('user-info');
  const [formData, setFormData] = useState({
    userInfo: null,
    goal: null,
    recommendation: null,
    feedback: null
  });

  const handleStepComplete = (step: Step, data: any) => {
    // Store the completed step data
    const updatedFormData = { ...formData, [step === 'user-info' ? 'userInfo' : step]: data };
    setFormData(updatedFormData);
    
    // Move to the next step
    const steps: Step[] = ['user-info', 'goal-setting', 'recommendation', 'feedback', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Debug output to console to help troubleshoot
  console.log('Current step:', currentStep);
  console.log('Form data:', formData);

  return (
    <main className="py-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI 营养助手
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              根据您的个人信息获取个性化营养建议
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center w-full max-w-3xl mx-auto">
              {['用户信息', '目标设定', '推荐结果', '反馈'].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                    ${index === ['user-info', 'goal-setting', 'recommendation', 'feedback'].indexOf(currentStep) 
                      ? 'bg-indigo-600 text-white' 
                      : index < ['user-info', 'goal-setting', 'recommendation', 'feedback'].indexOf(currentStep)
                      ? 'bg-indigo-200 text-indigo-800'
                      : index === 3 && currentStep === 'complete'  // 特殊处理完成状态的进度条
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {index + 1}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {currentStep === 'user-info' && (
              <UserInfoForm onComplete={(data) => handleStepComplete('user-info', data)} />
            )}
            {currentStep === 'goal-setting' && (
              <GoalSetting onComplete={(data) => handleStepComplete('goal-setting', data)} />
            )}
            {currentStep === 'recommendation' && (
              <RecommendationDisplay 
                userInfo={formData.userInfo}
                goal={formData.goal}
                onComplete={(data) => handleStepComplete('recommendation', data)}
              />
            )}
            {currentStep === 'feedback' && (
              <FeedbackForm onComplete={(data) => handleStepComplete('feedback', data)} />
            )}
            {currentStep === 'complete' && (
              <div className="text-center space-y-6 py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-semibold text-gray-900">感谢您的反馈！</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  我们已收到您的意见，这对我们持续改进 AI 营养助手非常有价值。
                </p>
                <button 
                  onClick={() => {
                    setCurrentStep('user-info');
                    setFormData({
                      userInfo: null,
                      goal: null,
                      recommendation: null,
                      feedback: null
                    });
                  }}
                  className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  重新开始
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 