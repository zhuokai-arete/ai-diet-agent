'use client';

import React, { useState } from 'react';

interface UserInfoFormProps {
  onComplete: (data: any) => void;
}

export default function UserInfoForm({ onComplete }: UserInfoFormProps) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryPreferences: '',
    foodAllergies: '',
    appetiteLevel: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-1">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            年龄
          </label>
          <input
            type="number"
            name="age"
            id="age"
            required
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            性别
          </label>
          <select
            name="gender"
            id="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">请选择性别</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div className="col-span-1">
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            身高 (厘米)
          </label>
          <input
            type="number"
            name="height"
            id="height"
            required
            value={formData.height}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            体重 (公斤)
          </label>
          <input
            type="number"
            name="weight"
            id="weight"
            required
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
            活动水平
          </label>
          <select
            name="activityLevel"
            id="activityLevel"
            required
            value={formData.activityLevel}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">请选择活动水平</option>
            <option value="sedentary">久坐不动 (几乎不运动)</option>
            <option value="light">轻度活动 (每周运动1-2天)</option>
            <option value="moderate">中度活动 (每周运动3-4天)</option>
            <option value="very">高度活动 (每周运动5-6天)</option>
            <option value="extra">极高活动 (高强度运动+体力劳动)</option>
          </select>
        </div>

        <div className="col-span-1">
          <label htmlFor="appetiteLevel" className="block text-sm font-medium text-gray-700">
            饮食习惯
          </label>
          <select
            name="appetiteLevel"
            id="appetiteLevel"
            required
            value={formData.appetiteLevel}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">请选择饮食习惯</option>
            <option value="small">少食</option>
            <option value="medium">正常</option>
            <option value="large">多食</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700">
          饮食偏好
        </label>
        <textarea
          name="dietaryPreferences"
          id="dietaryPreferences"
          rows={3}
          value={formData.dietaryPreferences}
          onChange={handleChange}
          placeholder="爱吃肉，纯素食，清真食品等"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="foodAllergies" className="block text-sm font-medium text-gray-700">
          饮食禁忌
        </label>
        <textarea
          name="foodAllergies"
          id="foodAllergies"
          rows={3}
          value={formData.foodAllergies}
          onChange={handleChange}
          placeholder="不喜欢吃的食物或饮食过敏"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          下一步
        </button>
      </div>
    </form>
  );
} 