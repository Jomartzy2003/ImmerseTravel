import type { Destination } from '@/types/database'

/**
 * AI Itinerary Generator
 * 
 * Generates personalized "Hidden Gems & Local Flavors" itineraries
 * based on destination data using AI.
 */

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  technicalTip: string
  sensoryHighlights: {
    sounds?: string
    smells?: string
    sights?: string
  }
}

export interface Itinerary {
  destination: string
  days: ItineraryDay[]
  markdown: string
}

/**
 * Generate itinerary prompt for AI
 */
function generatePrompt(destination: Destination): string {
  return `You are an expert travel architect for the "Immersive Travel" platform. The user is currently viewing a specific destination from our database.

DESTINATION DATA:
- Name: ${destination.title}
- Location: ${destination.location}, ${destination.country}
- Category: ${destination.category}
- Description: ${destination.description}

TASK:
Based on the data above, generate a "Hidden Gems & Local Flavors" itinerary. Focus on sensory details that match our "Immersive" brand (the sounds, smells, and sights).

OUTPUT REQUIREMENTS:
1. Provide a 3-day breakdown.
2. For each day, include one "Technical Tip" (e.g., best time for lighting, local transport hacks, or gear needed).
3. Keep it concise but premium.
4. Output in Markdown format with the following structure:

# Hidden Gems & Local Flavors
## ${destination.title}

### Day 1: [Evocative Title]
**Morning/Afternoon/Evening activities with sensory details**

**Technical Tip:** [Practical advice]

**Sensory Highlights:**
- 🔊 Sounds: [What you'll hear]
- 👃 Smells: [What you'll smell]
- 👁️ Sights: [What you'll see]

---

### Day 2: [Evocative Title]
[Same structure]

---

### Day 3: [Evocative Title]
[Same structure]

---

**Pro Tip:** [Final insider advice for the entire trip]`
}

/**
 * Generate itinerary using OpenAI API
 * Replace with your preferred AI provider (OpenAI, Anthropic, etc.)
 */
export async function generateItinerary(destination: Destination): Promise<Itinerary> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.')
  }

  const prompt = generatePrompt(destination)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel writer specializing in immersive, sensory-rich travel experiences. Your writing is elegant, evocative, and practical.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate itinerary')
    }

    const data = await response.json()
    const markdown = data.choices[0].message.content

    // Parse the markdown into structured data (optional)
    const days = parseMarkdownToDays(markdown)

    return {
      destination: destination.title,
      days,
      markdown,
    }
  } catch (error) {
    console.error('Error generating itinerary:', error)
    throw error
  }
}

/**
 * Parse markdown response into structured day objects
 */
function parseMarkdownToDays(markdown: string): ItineraryDay[] {
  const days: ItineraryDay[] = []
  const dayRegex = /### Day (\d+): (.+?)\n([\s\S]*?)(?=### Day \d+:|---\n\n\*\*Pro Tip|$)/g
  
  let match
  while ((match = dayRegex.exec(markdown)) !== null) {
    const dayNumber = parseInt(match[1])
    const title = match[2].trim()
    const content = match[3].trim()

    // Extract technical tip
    const tipMatch = content.match(/\*\*Technical Tip:\*\* (.+?)(?=\n|$)/i)
    const technicalTip = tipMatch ? tipMatch[1].trim() : ''

    // Extract sensory highlights
    const soundsMatch = content.match(/🔊 Sounds: (.+?)(?=\n|$)/i)
    const smellsMatch = content.match(/👃 Smells: (.+?)(?=\n|$)/i)
    const sightsMatch = content.match(/👁️ Sights: (.+?)(?=\n|$)/i)

    // Extract activities (paragraphs before Technical Tip)
    const activitiesText = content.split('**Technical Tip:**')[0].trim()
    const activities = activitiesText
      .split('\n\n')
      .filter(p => p.trim() && !p.startsWith('**Sensory'))
      .map(p => p.trim())

    days.push({
      day: dayNumber,
      title,
      activities,
      technicalTip,
      sensoryHighlights: {
        sounds: soundsMatch ? soundsMatch[1].trim() : undefined,
        smells: smellsMatch ? smellsMatch[1].trim() : undefined,
        sights: sightsMatch ? sightsMatch[1].trim() : undefined,
      },
    })
  }

  return days
}

/**
 * Alternative: Generate itinerary using Anthropic Claude
 */
export async function generateItineraryWithClaude(destination: Destination): Promise<Itinerary> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')
  }

  const prompt = generatePrompt(destination)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate itinerary')
    }

    const data = await response.json()
    const markdown = data.content[0].text

    const days = parseMarkdownToDays(markdown)

    return {
      destination: destination.title,
      days,
      markdown,
    }
  } catch (error) {
    console.error('Error generating itinerary:', error)
    throw error
  }
}

/**
 * Mock itinerary generator for development/testing
 */
export function generateMockItinerary(destination: Destination): Itinerary {
  const markdown = `# Hidden Gems & Local Flavors
## ${destination.title}

### Day 1: Dawn at the Edge of the World
Begin your journey before sunrise at a local viewpoint known only to residents. Watch as the first light paints the landscape in shades of amber and rose. Follow this with a visit to the morning market, where vendors arrange their wares with practiced precision.

**Technical Tip:** Arrive 30 minutes before official sunrise for the best golden hour photography. Bring a wide-angle lens (16-35mm) to capture the expansive vistas.

**Sensory Highlights:**
- 🔊 Sounds: The distant call of morning birds, the rustle of wind through native vegetation, vendors greeting each other in local dialect
- 👃 Smells: Fresh mountain air tinged with pine, wood smoke from breakfast fires, the earthy scent of morning dew
- 👁️ Sights: Mist rolling through valleys, the play of light on distant peaks, vibrant textiles at the market stalls

---

### Day 2: Hidden Trails & Culinary Secrets
Venture off the main tourist routes to discover a lesser-known trail that winds through ancient landscapes. Your local guide will point out indigenous plants and share stories passed down through generations. End the day at a family-run eatery where recipes have remained unchanged for decades.

**Technical Tip:** Wear layers—temperatures can vary dramatically between valley and ridge. Download offline maps as cell service is unreliable on remote trails.

**Sensory Highlights:**
- 🔊 Sounds: Crunch of gravel underfoot, distant waterfalls, the rhythmic chopping of vegetables in outdoor kitchens
- 👃 Smells: Wild herbs crushed underfoot, traditional spices simmering in clay pots, wood-fired ovens
- 👁️ Sights: Untouched wilderness vistas, hand-painted signs pointing to hidden villages, steam rising from traditional cooking vessels

---

### Day 3: Artisan Encounters & Sunset Rituals
Spend your final day with local artisans who practice crafts passed down through centuries. Watch skilled hands transform raw materials into works of art. As evening approaches, join locals at their favorite sunset spot—a place unmarked on any map but cherished by those who know.

**Technical Tip:** Bring small denominations of local currency for purchasing directly from artisans. Sunset occurs around 6:30 PM—arrive by 6:00 PM to secure the best vantage point.

**Sensory Highlights:**
- 🔊 Sounds: The rhythmic tap of artisan tools, soft conversations in the local language, evening prayers or songs echoing across the landscape
- 👃 Smells: Natural dyes and materials, incense from nearby shrines, the cooling earth as day transitions to night
- 👁️ Sights: Intricate craftwork taking shape, the sky transforming through a spectrum of colors, locals gathering for their evening rituals

---

**Pro Tip:** Learn three phrases in the local language: "hello," "thank you," and "this is beautiful." These simple words open doors and hearts, transforming you from tourist to welcomed guest.`

  const days = parseMarkdownToDays(markdown)

  return {
    destination: destination.title,
    days,
    markdown,
  }
}
