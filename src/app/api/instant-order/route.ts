import { NextRequest, NextResponse } from 'next/server'

const SONG_TEMPLATES = {
  'funny-birthday': {
    template: `[Verse 1]
Happy birthday to {NAME}, let me tell you what I see
{AGE} years old but still acts so free
{FUNNY_TRAIT_1}, that's your claim to fame
{FUNNY_TRAIT_2}, driving us insane

[Hook]
It's {NAME}'s birthday, time to celebrate
Even though {FUNNY_TRAIT_1} makes us all wait
Blow out candles, make a wish come true
Happy birthday, this roast's for you!

[Verse 2]
Another year older, but are you any wise?
{FUNNY_TRAIT_2}, much to our surprise
We love you anyway, despite your quirky ways
Happy birthday {NAME}, enjoy your special day!`,
    style: 'funny'
  },
  'funny-roast': {
    template: `[Verse 1]
Let me tell y'all about my friend {NAME}
{FUNNY_TRAIT_1}, that's their claim to fame
{FUNNY_TRAIT_2}, every single day
{EMBARRASSING_STORY}, in every way

[Hook]
{NAME}, {NAME}, what can we say?
You keep us laughing in your special way
We roast you 'cause we love you, it's true
This silly song is just for you!

[Verse 2]
{FUNNY_TRAIT_1}, never gonna change
{FUNNY_TRAIT_2}, acting so strange
But that's why we love you, through and through
{NAME}, this roast is dedicated to you!`,
    style: 'funny'
  },
  'success-anthem': {
    template: `[Verse 1]
Started from {HOMETOWN}, now I'm making moves
{ACHIEVEMENT_1}, got nothing to prove
{ACHIEVEMENT_2}, climbing every day
Success in my DNA, paving my own way

[Hook]
{NAME} on the rise, can't stop won't stop
From the bottom to the very top
Dreams becoming reality, watch me shine
Success is mine, this is my time!

[Verse 2]
Grinding every day, vision crystal clear
{ACHIEVEMENT_1}, year after year
{ACHIEVEMENT_2}, that's how I roll
{NAME} achieving every single goal!`,
    style: 'success'
  },
  'love-song': {
    template: `[Verse 1]
{NAME}, you're my queen, you're everything to me
{LOVE_TRAIT_1}, for the world to see
{LOVE_TRAIT_2}, every single day
In my heart, you'll always stay

[Hook]
{NAME}, you're my love, my heart, my soul
{SPECIAL_MEMORY}, making me whole
Through every season, through every year
{NAME}, you're the one I hold dear

[Verse 2]
{LOVE_TRAIT_1}, lighting up my world
{LOVE_TRAIT_2}, my precious girl
{SPECIAL_MEMORY}, forever in my mind
A love like ours is so hard to find`,
    style: 'love'
  }
}

const generateInstantLyrics = (template: string, formData: any): string => {
  let lyrics = SONG_TEMPLATES[template as keyof typeof SONG_TEMPLATES].template

  // Replace placeholders with actual data
  const replacements = {
    '{NAME}': formData.name || 'Friend',
    '{AGE}': formData.age || '25',
    '{FUNNY_TRAIT_1}': formData.funnyTrait1 || 'being awesome',
    '{FUNNY_TRAIT_2}': formData.funnyTrait2 || 'making us smile',
    '{EMBARRASSING_STORY}': formData.embarrassingStory || 'doing silly things',
    '{ACHIEVEMENT_1}': formData.achievement1 || 'working hard',
    '{ACHIEVEMENT_2}': formData.achievement2 || 'chasing dreams',
    '{HOMETOWN}': formData.hometown || 'the city',
    '{LOVE_TRAIT_1}': formData.loveTrait1 || 'your beautiful smile',
    '{LOVE_TRAIT_2}': formData.loveTrait2 || 'your kind heart',
    '{SPECIAL_MEMORY}': formData.specialMemory || 'our time together'
  }

  Object.entries(replacements).forEach(([placeholder, value]) => {
    lyrics = lyrics.replace(new RegExp(placeholder, 'g'), value)
  })

  return lyrics
}

export async function POST(request: NextRequest) {
  try {
    const { template, templateData, formData, timestamp } = await request.json()

    if (!template || !templateData || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate instant lyrics (10 seconds)
    const lyrics = generateInstantLyrics(template, formData)

    // Create order ID
    const orderId = `instant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // For MVP: Simulate instant song generation
    const orderData = {
      orderId,
      template,
      price: templateData.price,
      deliveryTime: templateData.deliveryTime,
      customer: {
        name: formData.customerName,
        email: formData.email
      },
      lyrics,
      status: 'processing',
      timestamp
    }

    // In production: This would trigger actual song generation
    console.log('Instant order created:', orderData)

    // Simulate song creation in background (don't wait)
    setTimeout(async () => {
      try {
        await createAndDeliverSong(orderData)
      } catch (error) {
        console.error('Song creation failed:', error)
      }
    }, 100) // Start immediately

    return NextResponse.json({
      success: true,
      orderId,
      message: `Song creation started! Will be delivered in ${templateData.deliveryTime}`,
      estimatedDelivery: new Date(Date.now() + (templateData.deliveryTime === '90 seconds' ? 90000 : 120000))
    })

  } catch (error) {
    console.error('Instant order error:', error)
    return NextResponse.json(
      { 
        error: 'Order processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Background song creation function
async function createAndDeliverSong(orderData: any) {
  const startTime = Date.now()
  console.log(`Creating song for order ${orderData.orderId}...`)

  try {
    // Step 1: Generate audio using AI (60 seconds max)
    const audioResult = await generateSongAudio(orderData.lyrics, orderData.template)
    
    // Step 2: Send email with song (5 seconds)
    await sendSongEmail(orderData.customer.email, audioResult.audioUrl, orderData)
    
    const totalTime = Date.now() - startTime
    console.log(`Song delivered for ${orderData.orderId} in ${totalTime}ms`)
    
    return { success: true, deliveryTime: totalTime }
    
  } catch (error) {
    console.error(`Song creation failed for ${orderData.orderId}:`, error)
    
    // Send error email to customer
    await sendErrorEmail(orderData.customer.email, orderData.orderId)
    
    throw error
  }
}

// Fast AI song generation
async function generateSongAudio(lyrics: string, template: string) {
  try {
    // Use fastest possible method - TTS + pre-made beat
    const songPrompt = `Create a rap song audio with these lyrics: "${lyrics.substring(0, 500)}..." 
    Style: ${template} 
    Requirements: Fast TTS-style rap vocals with background beat, 2-3 minutes duration`

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SA2gBNcLX2KKjm',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro', // Use for audio generation
        messages: [
          {
            role: 'user',
            content: songPrompt
          }
        ]
      }),
      signal: AbortSignal.timeout(90000) // 90 second timeout
    })

    const data = await response.json()
    const audioUrl = data.choices?.[0]?.message?.content || `https://example.com/generated-song-${Date.now()}.mp3`

    return { audioUrl, success: true }

  } catch (error) {
    console.error('Audio generation failed:', error)
    // Fallback: Return a mock URL for MVP
    return { 
      audioUrl: `https://example.com/mock-song-${Date.now()}.mp3`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Email delivery function
async function sendSongEmail(email: string, songUrl: string, orderData: any) {
  // For MVP: Log email instead of actually sending
  const emailContent = `
    🎉 Your Custom Rap Song is Ready!
    
    Hi ${orderData.customer.name},
    
    Your ${orderData.template} song has been created and is ready for download!
    
    Download your song: ${songUrl}
    
    Lyrics:
    ${orderData.lyrics}
    
    Thanks for using Instant Rap Songs!
    ⚡ Delivered in ${orderData.deliveryTime} as promised!
  `
  
  console.log('EMAIL SENT TO:', email)
  console.log('EMAIL CONTENT:', emailContent)
  
  // In production: Use actual email service (SendGrid, etc.)
  return { success: true }
}

async function sendErrorEmail(email: string, orderId: string) {
  console.log(`ERROR EMAIL: Song creation failed for order ${orderId}, customer: ${email}`)
  // In production: Send actual error email with refund offer
  return { success: true }
}