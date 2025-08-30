'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import LoadingAnimation from './LoadingAnimation'

interface RapVideoGeneratorProps {
  onVideoGenerated: (videoUrl: string) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  onAddToHistory: (video: any) => void
}

const STYLE_PRESETS = [
  { value: 'urban', label: 'Urban Street', description: 'City landscapes, street art, underground vibes' },
  { value: 'studio', label: 'Studio Session', description: 'Professional recording setup, neon lighting' },
  { value: 'neon', label: 'Neon Cyberpunk', description: 'Futuristic, neon-lit, cyberpunk aesthetic' },
  { value: 'vintage', label: 'Vintage Hip-Hop', description: 'Classic 90s hip-hop, retro style' },
  { value: 'cinematic', label: 'Cinematic Epic', description: 'Movie-quality, dramatic lighting' },
  { value: 'abstract', label: 'Abstract Art', description: 'Psychedelic, artistic, experimental' },
]

const DURATION_OPTIONS = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 90, label: '1.5 minutes' },
]

const QUALITY_OPTIONS = [
  { value: '720p', label: 'HD (720p)' },
  { value: '1080p', label: 'Full HD (1080p)' },
  { value: '1440p', label: '2K (1440p)' },
]

export default function RapVideoGenerator({ 
  onVideoGenerated, 
  isGenerating, 
  setIsGenerating, 
  onAddToHistory 
}: RapVideoGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('urban')
  const [duration, setDuration] = useState([30])
  const [quality, setQuality] = useState('1080p')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [generationProgress, setGenerationProgress] = useState(0)

  const enhancePrompt = (basePrompt: string, selectedStyle: string) => {
    const styleEnhancements = {
      urban: 'urban street scene, graffiti walls, city skyline, street lights, hip-hop culture',
      studio: 'professional recording studio, neon lighting, microphones, mixing board, artistic lighting',
      neon: 'cyberpunk aesthetic, neon lights, futuristic city, electronic atmosphere, synthwave colors',
      vintage: 'vintage 90s hip-hop style, retro equipment, classic boom box, old school aesthetic',
      cinematic: 'cinematic quality, dramatic lighting, movie-style composition, epic atmosphere',
      abstract: 'abstract artistic visuals, psychedelic patterns, creative experimental style'
    }

    return `${basePrompt}. ${styleEnhancements[selectedStyle as keyof typeof styleEnhancements]}. High quality music video production, professional cinematography, dynamic camera movements, ${quality} resolution.`
  }

  const generateVideo = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      const enhancedPrompt = enhancePrompt(prompt, style)
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90))
      }, 2000)

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          duration: duration[0],
          quality,
          aspectRatio,
          style,
        }),
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (!response.ok) {
        throw new Error(`Failed to generate video: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.videoUrl) {
        onVideoGenerated(data.videoUrl)
        
        // Add to history
        const historyItem = {
          id: Date.now(),
          prompt: prompt,
          style,
          duration: duration[0],
          quality,
          aspectRatio,
          videoUrl: data.videoUrl,
          timestamp: new Date().toISOString(),
          thumbnail: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/85f11b2e-49ed-4be5-9083-40b6cd1da4ad.png}+style+rap+music+video`
        }
        
        onAddToHistory(historyItem)
      }
    } catch (error) {
      console.error('Video generation failed:', error)
      alert('Failed to generate video. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const selectedStyleInfo = STYLE_PRESETS.find(s => s.value === style)

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-400">
          🎬 Video Generation Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-sm font-medium">
            Describe Your Rap Video Concept
          </Label>
          <Textarea
            id="prompt"
            placeholder="Describe your rap video scene... e.g., 'Artist performing in an abandoned warehouse with dramatic spotlights and smoke effects'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="bg-gray-800 border-gray-700 focus:border-purple-500 resize-none"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{prompt.length} characters</span>
            <span>Be specific for best results</span>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Video Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {STYLE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  <div>
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-xs text-gray-400">{preset.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedStyleInfo && (
            <p className="text-xs text-gray-400">{selectedStyleInfo.description}</p>
          )}
        </div>

        {/* Duration and Quality Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Duration</Label>
            <div className="space-y-3">
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={90}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>15s</span>
                <span className="font-medium text-purple-400">{duration[0]}s</span>
                <span>90s</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {QUALITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Aspect Ratio</Label>
          <div className="flex gap-2">
            {[
              { value: '16:9', label: '16:9 (Landscape)' },
              { value: '9:16', label: '9:16 (Vertical)' },
              { value: '1:1', label: '1:1 (Square)' },
            ].map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setAspectRatio(ratio.value)}
                className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                  aspectRatio === ratio.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Button */}
        <div className="space-y-4">
          <Button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 h-12"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <LoadingAnimation />
                <span>Generating Video...</span>
              </div>
            ) : (
              '🎬 Generate Epic Video'
            )}
          </Button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-400">
                {generationProgress < 30 && 'Analyzing your concept...'}
                {generationProgress >= 30 && generationProgress < 60 && 'Creating video scenes...'}
                {generationProgress >= 60 && generationProgress < 90 && 'Rendering final video...'}
                {generationProgress >= 90 && 'Almost ready...'}
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-purple-900/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-purple-400 mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Be specific about location, lighting, and mood</li>
            <li>• Mention camera angles (close-up, wide shot, etc.)</li>
            <li>• Include details about clothing, props, and atmosphere</li>
            <li>• Reference specific hip-hop or visual aesthetics</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}