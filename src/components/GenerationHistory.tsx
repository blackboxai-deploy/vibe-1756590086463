'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface HistoryItem {
  id: number
  prompt: string
  style: string
  duration: number
  quality: string
  aspectRatio: string
  videoUrl: string
  timestamp: string
  thumbnail: string
}

interface GenerationHistoryProps {
  history: HistoryItem[]
  onSelectVideo: (videoUrl: string) => void
}

export default function GenerationHistory({ history, onSelectVideo }: GenerationHistoryProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const filteredHistory = history.filter(item =>
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.style.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStyleColor = (style: string) => {
    const colors = {
      urban: 'bg-orange-500/20 text-orange-400',
      studio: 'bg-purple-500/20 text-purple-400',
      neon: 'bg-cyan-500/20 text-cyan-400',
      vintage: 'bg-amber-500/20 text-amber-400',
      cinematic: 'bg-red-500/20 text-red-400',
      abstract: 'bg-pink-500/20 text-pink-400',
    }
    return colors[style as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const downloadAll = () => {
    history.forEach((item, index) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = item.videoUrl
        a.download = `rap-video-${item.id}.mp4`
        a.click()
      }, index * 1000) // Stagger downloads by 1 second
    })
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      // This would need to be implemented by parent component
      console.log('Clear history requested')
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-purple-400">
            📚 Generation History
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
            {history.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        {history.length > 0 && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
            />
            
            {/* Bulk Actions */}
            <div className="flex gap-2">
              <Button
                onClick={downloadAll}
                disabled={history.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-8"
              >
                📥 Download All
              </Button>
              <Button
                onClick={clearHistory}
                disabled={history.length === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 h-8"
              >
                🗑️ Clear
              </Button>
            </div>
          </div>
        )}

        {/* History List */}
        <ScrollArea className="h-96">
          {filteredHistory.length > 0 ? (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/30 transition-colors cursor-pointer"
                  onClick={() => onSelectVideo(item.videoUrl)}
                >
                  {/* Thumbnail and Basic Info */}
                  <div className="flex gap-3 mb-2">
                    <div className="w-16 h-9 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/15959610-6cc5-4607-8fad-1da9c63f08ef.png'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-white font-medium truncate pr-2">
                          {item.prompt.substring(0, 50)}
                          {item.prompt.length > 50 && '...'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(item.id)
                          }}
                          className="text-yellow-400 hover:text-yellow-300 flex-shrink-0"
                        >
                          {favorites.includes(item.id) ? '⭐' : '☆'}
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs ${getStyleColor(item.style)}`}>
                          {item.style}
                        </Badge>
                        <span className="text-xs text-gray-400">{item.duration}s</span>
                        <span className="text-xs text-gray-400">{item.quality}</span>
                        <span className="text-xs text-gray-400">{item.aspectRatio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 mb-2">
                    {formatTimestamp(item.timestamp)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectVideo(item.videoUrl)
                      }}
                      className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs py-1 h-7"
                    >
                      ▶️ Play
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        const a = document.createElement('a')
                        a.href = item.videoUrl
                        a.download = `rap-video-${item.id}.mp4`
                        a.click()
                      }}
                      className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs py-1 h-7"
                    >
                      📥 Download
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(item.videoUrl)
                      }}
                      className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs py-1 h-7"
                    >
                      📋 Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found for "{searchTerm}"</p>
              <Button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-gray-400 mb-2">No videos generated yet</p>
              <p className="text-sm text-gray-500">
                Your generated videos will appear here
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Statistics */}
        {history.length > 0 && (
          <div className="bg-purple-900/20 rounded-lg p-3 mt-4">
            <h4 className="text-sm font-medium text-purple-400 mb-2">📊 Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>Total videos: {history.length}</div>
              <div>Favorites: {favorites.length}</div>
              <div>
                Most used style: {
                  history.length > 0 
                    ? Object.entries(
                        history.reduce((acc, item) => {
                          acc[item.style] = (acc[item.style] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                    : 'None'
                }
              </div>
              <div>
                Avg duration: {
                  history.length > 0 
                    ? Math.round(history.reduce((sum, item) => sum + item.duration, 0) / history.length)
                    : 0
                }s
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}