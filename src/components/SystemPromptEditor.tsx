'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SystemPromptEditorProps {
  onClose: () => void
}

const DEFAULT_SYSTEM_PROMPT = `You are an expert video generation AI specializing in creating high-quality rap music videos. Your role is to transform user concepts into detailed, professional video descriptions that result in stunning visual content.

Key Guidelines:
- Focus on cinematic quality and professional music video production values
- Incorporate dynamic camera movements, lighting effects, and visual storytelling
- Understand hip-hop culture, urban aesthetics, and rap video conventions  
- Emphasize mood, atmosphere, and visual impact
- Include specific technical details for optimal video generation
- Ensure each generated video feels authentic and engaging

Always enhance user prompts with:
1. Professional cinematography techniques
2. Appropriate lighting and color schemes  
3. Relevant urban/hip-hop visual elements
4. Dynamic scene composition
5. High production quality specifications`

const PRESET_PROMPTS = [
  {
    name: 'Default Professional',
    prompt: DEFAULT_SYSTEM_PROMPT
  },
  {
    name: 'Cinematic Focus',
    prompt: `You are a cinematic video generation specialist focused on creating movie-quality rap music videos. Emphasize dramatic lighting, professional camera work, and high-end production values. Every video should look like it belongs in a major music video or film production.

Transform concepts into:
- Epic cinematic scenes with dramatic lighting
- Professional camera movements (dolly, crane, steadicam)
- High contrast, color-graded visuals
- Atmospheric effects (fog, lighting, particles)
- Multiple camera angles and dynamic compositions`
  },
  {
    name: 'Urban Street Culture',
    prompt: `You are an urban culture video specialist creating authentic street-style rap videos. Focus on real hip-hop environments, street art, urban landscapes, and authentic cultural elements.

Generate videos featuring:
- Authentic urban environments and street settings
- Graffiti walls, city skylines, underground venues
- Real hip-hop culture and street aesthetics  
- Natural lighting and gritty, realistic visuals
- Community spaces and urban architecture`
  },
  {
    name: 'Experimental Creative',
    prompt: `You are a creative visionary specializing in experimental and artistic rap music videos. Push boundaries with abstract visuals, creative effects, and innovative artistic approaches.

Create innovative videos with:
- Abstract and surreal visual elements
- Creative visual effects and transitions
- Artistic lighting and color experiments
- Unique perspectives and unconventional shots
- Psychedelic and dreamlike atmospheres`
  }
]

export default function SystemPromptEditor({ onClose }: SystemPromptEditorProps) {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('custom')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load saved prompt or use default
    const savedPrompt = localStorage.getItem('rap-video-system-prompt')
    setCurrentPrompt(savedPrompt || DEFAULT_SYSTEM_PROMPT)
  }, [])

  const handlePresetChange = (presetName: string) => {
    if (presetName === 'custom') {
      setSelectedPreset('custom')
      return
    }

    const preset = PRESET_PROMPTS.find(p => p.name === presetName)
    if (preset) {
      setCurrentPrompt(preset.prompt)
      setSelectedPreset(presetName)
      setHasChanges(true)
    }
  }

  const handlePromptChange = (value: string) => {
    setCurrentPrompt(value)
    setHasChanges(true)
    
    // Check if it matches any preset
    const matchingPreset = PRESET_PROMPTS.find(p => p.prompt === value)
    setSelectedPreset(matchingPreset ? matchingPreset.name : 'custom')
  }

  const savePrompt = () => {
    localStorage.setItem('rap-video-system-prompt', currentPrompt)
    setHasChanges(false)
    alert('System prompt saved successfully!')
  }

  const resetToDefault = () => {
    if (confirm('Reset to default system prompt? Your current changes will be lost.')) {
      setCurrentPrompt(DEFAULT_SYSTEM_PROMPT)
      setSelectedPreset('Default Professional')
      setHasChanges(true)
    }
  }

  const testPrompt = () => {
    // This would integrate with the video generation system
    console.log('Testing prompt:', currentPrompt)
    alert('Prompt test initiated! Check the console for details.')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-gray-900 border-purple-500/30 overflow-hidden">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-purple-400">
              ⚙️ AI System Prompt Customization
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 p-0 rounded-full"
            >
              ✕
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Customize how the AI interprets and enhances your video generation prompts. 
            This controls the style, quality, and artistic direction of all generated videos.
          </p>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Preset Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Prompt Presets</h3>
                <Badge 
                  variant={hasChanges ? "destructive" : "secondary"}
                  className={hasChanges ? "bg-yellow-600/20 text-yellow-400" : "bg-green-600/20 text-green-400"}
                >
                  {hasChanges ? "Unsaved Changes" : "Saved"}
                </Badge>
              </div>
              
              <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select a preset..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {PRESET_PROMPTS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-sm text-gray-400">
                Choose a preset or create your own custom system prompt below.
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">System Prompt</h3>
                <div className="text-sm text-gray-400">
                  {currentPrompt.length} characters
                </div>
              </div>
              
              <Textarea
                value={currentPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Enter your custom system prompt..."
                rows={12}
                className="bg-gray-800 border-gray-700 focus:border-purple-500 resize-none font-mono text-sm"
              />
              
              <div className="text-xs text-gray-500">
                💡 Tip: Be specific about video styles, camera techniques, lighting, and mood. 
                The AI will use this prompt to enhance every video generation request.
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-purple-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-400 mb-3">✨ Writing Effective System Prompts</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li>• <strong>Be specific:</strong> Mention exact camera techniques, lighting styles, and visual elements</li>
                <li>• <strong>Set the tone:</strong> Define the overall aesthetic and mood you want to achieve</li>
                <li>• <strong>Include technical details:</strong> Resolution, frame rates, aspect ratios, quality standards</li>
                <li>• <strong>Reference styles:</strong> Mention specific video styles, directors, or artistic movements</li>
                <li>• <strong>Consider culture:</strong> Include understanding of hip-hop culture and rap video conventions</li>
                <li>• <strong>Quality focus:</strong> Emphasize professional production values and cinematic quality</li>
              </ul>
            </div>

            {/* Example Enhancements */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">🎬 Example Enhancement</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-gray-400 mb-1">User Input:</div>
                  <div className="bg-gray-700/50 p-2 rounded italic">"Rapper in studio"</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">AI Enhancement:</div>
                  <div className="bg-gray-700/50 p-2 rounded">
                    "Professional rapper performing in high-end recording studio with dramatic neon lighting, 
                    multiple camera angles, cinematic depth of field, mixing board in background, 
                    atmospheric smoke effects, HD quality production"
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <Button
                onClick={savePrompt}
                disabled={!hasChanges}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                💾 Save Prompt
              </Button>
              <Button
                onClick={testPrompt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                🧪 Test Prompt
              </Button>
              <Button
                onClick={resetToDefault}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                🔄 Reset to Default
              </Button>
            </div>

            {/* Model Information */}
            <div className="bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-400 mb-2">🤖 Model Information</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Video Model: Veo-3 (Google)</div>
                <div>Provider: Replicate via Custom Endpoint</div>
                <div>Quality: Professional HD Video Generation</div>
                <div>Capabilities: Text-to-video, style control, duration options</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}