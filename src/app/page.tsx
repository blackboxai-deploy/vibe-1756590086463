'use client'

import { useState } from 'react'
import RapVideoGenerator from '@/components/RapVideoGenerator'
import VideoPreview from '@/components/VideoPreview'
import GenerationHistory from '@/components/GenerationHistory'
import SystemPromptEditor from '@/components/SystemPromptEditor'

export default function HomePage() {
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<any[]>([])
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">🎵</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Rap Video Generator
                </h1>
                <p className="text-gray-400 text-sm">Transform concepts into epic music videos</p>
              </div>
            </div>
            <button
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
            >
              Customize AI
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                CREATE EPIC
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                RAP VIDEOS
              </span>
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Transform your rap concepts into stunning music video scenes using cutting-edge AI technology. 
            From urban landscapes to studio sessions, bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full">🎬 HD Video Generation</span>
            <span className="px-3 py-1 bg-pink-500/20 rounded-full">🎨 Multiple Styles</span>
            <span className="px-3 py-1 bg-blue-500/20 rounded-full">⚡ Lightning Fast</span>
            <span className="px-3 py-1 bg-green-500/20 rounded-full">💾 Download Ready</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Generation Interface - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RapVideoGenerator 
              onVideoGenerated={setGeneratedVideo}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onAddToHistory={(video) => setGenerationHistory(prev => [video, ...prev])}
            />
          </div>

          {/* Video Preview - Takes up 1 column */}
          <div className="lg:col-span-1">
            <VideoPreview 
              videoUrl={generatedVideo}
              isGenerating={isGenerating}
            />
          </div>

          {/* History Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1">
            <GenerationHistory 
              history={generationHistory}
              onSelectVideo={setGeneratedVideo}
            />
          </div>
        </div>
      </div>

      {/* System Prompt Editor Modal */}
      {showSystemPrompt && (
        <SystemPromptEditor onClose={() => setShowSystemPrompt(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Powered by cutting-edge AI technology for music video creation
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-xs text-gray-500">
              <span>Professional Quality</span>
              <span>•</span>
              <span>Multiple Formats</span>
              <span>•</span>
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}