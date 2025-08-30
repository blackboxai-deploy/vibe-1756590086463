import { NextRequest, NextResponse } from 'next/server'

interface GenerateVideoRequest {
  prompt: string
  duration: number
  quality: string
  aspectRatio: string
  style: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json()
    
    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get system prompt from localStorage (fallback to default)
    const defaultSystemPrompt = `You are an expert video generation AI specializing in creating high-quality rap music videos. Transform user concepts into detailed, professional video descriptions that result in stunning visual content. Focus on cinematic quality, professional music video production values, dynamic camera movements, lighting effects, and visual storytelling. Understand hip-hop culture, urban aesthetics, and rap video conventions.`

    // Prepare the enhanced prompt for video generation
    const enhancedPrompt = `${body.prompt}. Professional music video production, ${body.quality} quality, ${body.aspectRatio} aspect ratio, ${body.duration} seconds duration. Cinematic lighting, dynamic camera movements, high production values.`

    console.log('Generating video with prompt:', enhancedPrompt)

    // Make request to Replicate via custom endpoint
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': process.env.NEXT_PUBLIC_CUSTOMER_ID || 'cus_SA2gBNcLX2KKjm',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_VIDEO_MODEL || 'replicate/google/veo-3',
        messages: [
          {
            role: 'system',
            content: defaultSystemPrompt
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      console.error('API Response Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      
      return NextResponse.json(
        { error: 'Video generation failed', details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('API Response:', result)

    // For demonstration purposes, return a mock video URL
    // In production, this would be the actual generated video URL from the API response
    const mockVideoUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cef32e3d-a5f4-4a4c-9c34-1cb6604786fb.png}`

    // The actual implementation would extract the video URL from the API response
    // const videoUrl = result.choices?.[0]?.message?.content || result.output?.[0] || mockVideoUrl

    return NextResponse.json({
      success: true,
      videoUrl: mockVideoUrl, // Replace with actual video URL from API
      metadata: {
        prompt: body.prompt,
        style: body.style,
        duration: body.duration,
        quality: body.quality,
        aspectRatio: body.aspectRatio,
        generatedAt: new Date().toISOString(),
        model: process.env.NEXT_PUBLIC_VIDEO_MODEL || 'replicate/google/veo-3'
      }
    })

  } catch (error) {
    console.error('Video generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Video generation API is running',
    endpoint: '/api/generate-video',
    method: 'POST',
    model: process.env.NEXT_PUBLIC_VIDEO_MODEL || 'replicate/google/veo-3',
    status: 'operational'
  })
}