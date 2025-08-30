import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() || 0,
      version: '1.0.0',
      services: {
        database: 'not_applicable',
        ai_api: 'operational',
        video_generation: 'operational'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://oi-server.onrender.com/chat/completions',
        videoModel: process.env.NEXT_PUBLIC_VIDEO_MODEL || 'replicate/google/veo-3'
      }
    }

    return NextResponse.json(healthStatus)
    
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}