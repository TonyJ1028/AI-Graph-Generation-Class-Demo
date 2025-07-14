'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptInput({ value, onChange, placeholder = "输入提示词..." }: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const quickPrompts = [
    "添加眼镜",
    "改变背景为蓝天白云",
    "添加笑容",
    "改变发色为金色",
    "添加帽子",
    "改变服装颜色"
  ];

  const insertQuickPrompt = (prompt: string) => {
    const newValue = value ? `${value}, ${prompt}` : prompt;
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        提示词
      </label>

      <div className="relative">
        <div className={`absolute left-3 top-3 transition-colors ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`}>
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={3}
          className={`w-full pl-10 sm:pl-11 pr-4 py-3 text-base border rounded-lg resize-none transition-colors touch-manipulation ${
            isFocused
              ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
              : 'border-gray-300 hover:border-gray-400'
          } focus:outline-none`}
          style={{
            WebkitOverflowScrolling: 'touch'
          }}
        />

        <div className="absolute bottom-2 right-3 text-xs text-gray-400">
          {value.length}/1000
        </div>
      </div>

      {/* Quick Prompts - Mobile Optimized */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">快速提示词：</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => insertQuickPrompt(prompt)}
              className="px-2 py-2 sm:px-3 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg sm:rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation text-center"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Character count warning */}
      {value.length > 800 && (
        <p className="text-xs text-amber-600">
          提示词较长，可能影响生成效果
        </p>
      )}

      {value.length >= 1000 && (
        <p className="text-xs text-red-600">
          提示词已达到最大长度限制
        </p>
      )}
    </div>
  );
}
