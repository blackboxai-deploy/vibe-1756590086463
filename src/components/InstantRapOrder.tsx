'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const INSTANT_TEMPLATES = {
  'funny-birthday': {
    name: '😂 Funny Birthday Song',
    price: 15,
    description: 'Hilarious birthday roast that will have everyone cracking up',
    deliveryTime: '90 seconds',
    example: 'Happy birthday to Jake, let me tell you what I see...',
    fields: ['name', 'age', 'funnyTrait1', 'funnyTrait2']
  },
  'funny-roast': {
    name: '🔥 Roast My Friend',
    price: 15,
    description: 'Epic roasting session about your friend quirks and habits',
    deliveryTime: '90 seconds',
    example: 'Mike thinks he can cook but burns everything...',
    fields: ['name', 'funnyTrait1', 'funnyTrait2', 'embarrassingStory']
  },
  'success-anthem': {
    name: '💰 Success Anthem',
    price: 20,
    description: 'Motivational rap about your achievements and hustle',
    deliveryTime: '2 minutes',
    example: 'Started from the bottom now I am here...',
    fields: ['name', 'achievement1', 'achievement2', 'hometown']
  },
  'love-song': {
    name: '❤️ Love Song Rap',
    price: 20,
    description: 'Sweet rap song for your special someone',
    deliveryTime: '2 minutes',
    example: 'Sarah you are my queen, you are my everything...',
    fields: ['name', 'loveTrait1', 'loveTrait2', 'specialMemory']
  }
}

const FIELD_LABELS = {
  name: 'Person name',
  age: 'Their age',
  funnyTrait1: 'Funny thing about them #1',
  funnyTrait2: 'Funny thing about them #2',
  embarrassingStory: 'Embarrassing/funny story',
  achievement1: 'Your biggest achievement',
  achievement2: 'Something you are proud of',
  hometown: 'Your city/hometown',
  loveTrait1: 'What you love about them #1',
  loveTrait2: 'What you love about them #2',
  specialMemory: 'Special memory together'
}

const FIELD_PLACEHOLDERS = {
  name: 'Jake',
  age: '25',
  funnyTrait1: 'Burns everything he cooks',
  funnyTrait2: 'Thinks he is a chef but cannot boil water',
  embarrassingStory: 'Last week he set off the smoke alarm making toast',
  achievement1: 'Started my own business',
  achievement2: 'Bought my first house',
  hometown: 'Chicago',
  loveTrait1: 'Your beautiful smile',
  loveTrait2: 'How you always make me laugh',
  specialMemory: 'Our first date at the coffee shop'
}

export default function InstantRapOrder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [formData, setFormData] = useState<Record<string, string>>({
    email: '',
    customerName: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedTemplateData = selectedTemplate ? INSTANT_TEMPLATES[selectedTemplate as keyof typeof INSTANT_TEMPLATES] : null

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    if (!selectedTemplate || !formData.email || !formData.customerName) return false
    
    if (selectedTemplateData) {
      return selectedTemplateData.fields.every(field => formData[field]?.trim())
    }
    return false
  }

  const handleInstantOrder = async () => {
    if (!isFormValid()) return

    setIsProcessing(true)

    try {
      const orderData = {
        template: selectedTemplate,
        templateData: selectedTemplateData,
        formData: formData,
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/instant-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        setShowSuccess(true)
      } else {
        throw new Error(result.error || 'Order failed')
      }
    } catch (error) {
      console.error('Order failed:', error)
      alert('Order failed. Please try again!')
    } finally {
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="max-w-md mx-auto bg-gray-900/50 border-green-500/30">
        <CardContent className="text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-400 mb-4">Order Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your custom rap song is being created right now!
          </p>
          <div className="bg-green-900/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300">
              ⚡ Song will be in your email within {selectedTemplateData?.deliveryTime}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Create Another Song
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Template Selection */}
      {!selectedTemplate && (
        <Card className="bg-gray-900/50 border-green-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-center text-green-400">
              ⚡ Choose Your Instant Rap Style
            </CardTitle>
            <p className="text-center text-gray-400 text-sm">
              Each song is custom-made and delivered lightning fast!
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(INSTANT_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg border-2 border-gray-700 hover:border-green-500 cursor-pointer transition-all bg-gray-800/30 hover:bg-gray-800/50"
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div className="text-center mb-3">
                    <div className="text-2xl mb-2">{template.name}</div>
                    <div className="text-2xl font-bold text-green-400">${template.price}</div>
                    <div className="text-xs text-yellow-400">⚡ {template.deliveryTime}</div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3 text-center">
                    {template.description}
                  </p>
                  
                  <div className="bg-gray-900/50 rounded p-2">
                    <p className="text-xs text-gray-500 italic">
                      Example: {template.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="bg-yellow-900/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">🚀 Why So Fast?</h4>
                <p className="text-xs text-gray-400">
                  We use lightning-fast AI + pre-made beats + instant delivery. 
                  No waiting, no previews, just instant rap magic!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Form */}
      {selectedTemplate && selectedTemplateData && (
        <Card className="bg-gray-900/50 border-green-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-400">
                  {selectedTemplateData.name}
                </CardTitle>
                <p className="text-gray-400 text-sm">${selectedTemplateData.price} • ⚡ {selectedTemplateData.deliveryTime}</p>
              </div>
              <Button 
                onClick={() => setSelectedTemplate('')}
                className="bg-gray-600 hover:bg-gray-700 text-sm"
              >
                ← Change Style
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Template-specific fields */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Tell us about the song:</h4>
              {selectedTemplateData.fields.map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={`${FIELD_LABELS[field as keyof typeof FIELD_LABELS]} (e.g., "${FIELD_PLACEHOLDERS[field as keyof typeof FIELD_PLACEHOLDERS]}")`}
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">📋 Order Summary</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Style: {selectedTemplateData.name}</div>
                <div>Price: ${selectedTemplateData.price}</div>
                <div>Delivery: ⚡ {selectedTemplateData.deliveryTime}</div>
                <div>Format: MP3 + Lyrics included</div>
              </div>
            </div>

            {/* Order Button */}
            <Button
              onClick={handleInstantOrder}
              disabled={!isFormValid() || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
            >
              {isProcessing ? (
                '⏳ Processing Order...'
              ) : (
                `💳 Pay $${selectedTemplateData.price} & Get Song in ${selectedTemplateData.deliveryTime}!`
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              🔒 Secure payment • ⚡ Instant delivery • 💯 Satisfaction guaranteed
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}