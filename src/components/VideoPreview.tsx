'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingAnimation from './LoadingAnimation'

interface VideoPreviewProps {
  videoUrl: string | null
  isGenerating: boolean
}

export default function VideoPreview({ videoUrl, isGenerating }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = async (format: string = 'mp4') => {
    if (!videoUrl) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rap-video-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const shareVideo = async (platform: string) => {
    if (!videoUrl) return

    const shareData = {
      title: 'Check out my AI-generated rap video!',
      text: 'Created with AI Rap Video Generator',
      url: window.location.href,
    }

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(videoUrl)
      alert('Video URL copied to clipboard!')
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-400">
          📺 Video Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player Container */}
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <LoadingAnimation />
              <p className="text-gray-400 mt-4">Generating your epic video...</p>
              <div className="mt-2 text-xs text-gray-500">
                This may take 5-10 minutes for best quality
              </div>
            </div>
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ab0df1e6-2403-45dc-9e34-9c96a91b92ce.png"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎬</span>
              </div>
              <p className="text-lg font-medium">Your video will appear here</p>
              <p className="text-sm text-gray-500 mt-1">Enter a concept above to get started</p>
            </div>
          )}
        </div>

        {/* Video Controls */}
        {videoUrl && !isGenerating && (
          <div className="space-y-3">
            {/* Play/Pause Button */}
            <div className="flex items-center justify-center">
              <Button
                onClick={togglePlay}
                className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 p-0"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Download Section */}
            <div className="space-y-3 pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium text-purple-400">💾 Download Options</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleDownload('mp4')}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  {isDownloading ? 'Downloading...' : 'MP4 HD'}
                </Button>
                <Button
                  onClick={() => handleDownload('webm')}
                  disabled={isDownloading}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  WebM
                </Button>
              </div>
            </div>

            {/* Share Section */}
            <div className="space-y-3 pt-2 border-t border-gray-700">
              <h4 className="text-sm font-medium text-purple-400">📱 Share</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => shareVideo('native')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm"
                >
                  Share
                </Button>
                <Button
                  onClick={() => navigator.clipboard.writeText(videoUrl)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm"
                >
                  Copy URL
                </Button>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-purple-900/20 rounded-lg p-3">
              <h4 className="text-sm font-medium text-purple-400 mb-2">ℹ️ Video Info</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Duration: {formatTime(duration)}</div>
                <div>Format: MP4 HD</div>
                <div>Generated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Generation Tips */}
        {!videoUrl && !isGenerating && (
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-purple-400 mb-2">🚀 Ready to Create?</h4>
            <p className="text-xs text-gray-400">
              Describe your rap video concept in detail for the best results. 
              The more specific you are, the better your video will be!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}