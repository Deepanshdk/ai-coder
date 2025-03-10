"use client"

import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate.push(`/builder?prompt=${prompt}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6 animate-float">
            <Wand2 className="w-16 h-16 text-purple-400 transform hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            Website Builder AI
          </h1>
          <p className="text-xl text-gray-200 font-light">
            Describe your dream website, and we&apos;ll help you build it step by step
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="backdrop-blur-md bg-white/5 rounded-xl p-8 border border-white/10">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-40 p-5 bg-transparent text-white border-2 border-purple-500/30 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 resize-none placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Generate Website✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}