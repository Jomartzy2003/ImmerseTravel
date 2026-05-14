# AI Itinerary Feature Guide

## Overview

The AI Itinerary Generator creates personalized "Hidden Gems & Local Flavors" travel itineraries for each destination in your Immersive Travel application. It uses AI to generate sensory-rich, 3-day itineraries with technical tips for travelers.

## How It Works

### User Flow

1. User navigates to a destination detail page
2. Scrolls to the "Hidden Gems & Local Flavors" section
3. Clicks "Generate Your Personalized Itinerary"
4. AI generates a custom 3-day itinerary based on:
   - Destination name
   - Location and country
   - Category (mountains, beaches, cities, wilderness)
   - Description
5. Itinerary appears with beautiful Markdown formatting
6. User can copy, regenerate, or save the itinerary

### AI Prompt Structure

The system sends this information to the AI:

```
You are an expert travel architect for the "Immersive Travel" platform.

DESTINATION DATA:
- Name: Misty Peaks of Patagonia
- Location: Torres del Paine, Chile
- Category: mountains
- Description: Where the earth touches the sky...

TASK:
Generate a "Hidden Gems & Local Flavors" itinerary focusing on:
- Sensory details (sounds, smells, sights)
- 3-day breakdown
- Technical tips for each day
- Premium, concise writing
```

### AI Response Format

The AI returns Markdown structured as:

```markdown
# Hidden Gems & Local Flavors
## [Destination Name]

### Day 1: [Evocative Title]
[Morning/afternoon/evening activities with sensory descriptions]

**Technical Tip:** [Practical advice for photographers/travelers]

**Sensory Highlights:**
- 🔊 Sounds: [Ambient sounds you'll experience]
- 👃 Smells: [Scents in the air]
- 👁️ Sights: [Visual highlights]

---

### Day 2: [Title]
[Same structure]

---

### Day 3: [Title]
[Same structure]

---

**Pro Tip:** [Final insider advice]
```

## Setup Options

### Option 1: OpenAI (Recommended)

**Pros:**
- GPT-4 produces excellent travel writing
- Reliable and well-documented
- Good at following complex prompts

**Cons:**
- Costs ~$0.03 per itinerary
- Requires OpenAI account

**Setup:**
1. Sign up at [platform.openai.com](https://platform.openai.com/)
2. Create an API key
3. Add to `.env`:
```env
VITE_OPENAI_API_KEY=sk-proj-...your-key
```
4. Restart dev server

### Option 2: Anthropic Claude

**Pros:**
- Claude 3 Sonnet is excellent at creative writing
- Slightly cheaper (~$0.015 per itinerary)
- Good at nuanced, sensory descriptions

**Cons:**
- Requires Anthropic account
- Slightly different API structure

**Setup:**
1. Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Add to `.env`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-...your-key
```
4. Update `ItinerarySection.tsx` to use `generateItineraryWithClaude()`

### Option 3: Demo Mode (No API Key)

**Pros:**
- Works immediately, no setup
- Perfect for development and demos
- No costs

**Cons:**
- Uses generic mock data
- Same itinerary for all destinations

**Setup:**
- Nothing! Just don't add an API key
- The app automatically detects and uses mock mode

## Customization

### Changing Itinerary Length

Edit `src/lib/ai-itinerary.ts`:

```typescript
// Change from 3 days to 5 days
OUTPUT REQUIREMENTS:
1. Provide a 5-day breakdown.
```

### Adding More Sections

Modify the prompt to include:

```typescript
3. Include a "Where to Eat" section with 2-3 local restaurants
4. Add a "Getting Around" section with transport tips
```

### Adjusting Writing Style

Change the system message:

```typescript
{
  role: 'system',
  content: 'You are a luxury travel writer for National Geographic. Your writing is poetic, adventurous, and inspiring.'
}
```

### Changing AI Model

For OpenAI:
```typescript
model: 'gpt-4-turbo-preview', // Faster, cheaper
// or
model: 'gpt-3.5-turbo', // Much cheaper, less creative
```

For Anthropic:
```typescript
model: 'claude-3-opus-20240229', // Most capable
// or
model: 'claude-3-haiku-20240307', // Fastest, cheapest
```

## Cost Management

### Estimated Costs

| Provider | Model | Cost per Itinerary | Quality |
|----------|-------|-------------------|---------|
| OpenAI | GPT-4 | $0.03 | Excellent |
| OpenAI | GPT-4 Turbo | $0.015 | Excellent |
| OpenAI | GPT-3.5 Turbo | $0.002 | Good |
| Anthropic | Claude 3 Opus | $0.03 | Excellent |
| Anthropic | Claude 3 Sonnet | $0.015 | Excellent |
| Anthropic | Claude 3 Haiku | $0.0025 | Good |

### Optimization Strategies

#### 1. Caching (Recommended)

Add an `itineraries` table to cache generated content:

```sql
CREATE TABLE itineraries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  destination_id UUID REFERENCES destinations(id) UNIQUE,
  markdown TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Then check cache before generating:

```typescript
// Check cache first
const { data: cached } = await supabase
  .from('itineraries')
  .select('markdown')
  .eq('destination_id', destination.id)
  .single()

if (cached) {
  return { markdown: cached.markdown, ... }
}

// Generate and cache
const itinerary = await generateItinerary(destination)
await supabase
  .from('itineraries')
  .insert({
    destination_id: destination.id,
    markdown: itinerary.markdown
  })
```

#### 2. Rate Limiting

Limit users to X generations per day:

```typescript
// Track in user_saves or new table
const { count } = await supabase
  .from('itinerary_generations')
  .select('*', { count: 'exact' })
  .eq('user_id', user.id)
  .gte('created_at', new Date(Date.now() - 24*60*60*1000))

if (count >= 5) {
  throw new Error('Daily limit reached. Try again tomorrow!')
}
```

#### 3. Batch Generation

Pre-generate itineraries for all destinations:

```bash
# Create a script: scripts/generate-all-itineraries.ts
npm run generate-itineraries
```

#### 4. Use Cheaper Models for Development

```typescript
const model = import.meta.env.DEV 
  ? 'gpt-3.5-turbo'  // Development
  : 'gpt-4'          // Production
```

## Security Best Practices

### ⚠️ Current Implementation (Client-Side)

The current implementation calls AI APIs directly from the browser. This means:

**Risks:**
- API keys are exposed in the client bundle
- Anyone can inspect and steal your key
- No rate limiting or usage control
- Users can make unlimited API calls

**Acceptable for:**
- Development and testing
- Personal projects
- Demos and prototypes

### ✅ Production Implementation (Server-Side)

For production, move AI generation to a backend API:

#### Option A: Next.js API Route

```typescript
// pages/api/generate-itinerary.ts
import { generateItinerary } from '@/lib/ai-itinerary'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  // Verify authentication
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Rate limiting
  // ... check user's generation count

  // Generate itinerary
  const { destinationId } = req.body
  const itinerary = await generateItinerary(destination)
  
  res.json(itinerary)
}
```

#### Option B: Supabase Edge Function

```typescript
// supabase/functions/generate-itinerary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verify JWT
  const authHeader = req.headers.get('Authorization')
  const supabase = createClient(...)
  const { data: { user } } = await supabase.auth.getUser(authHeader)
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Generate itinerary
  const { destinationId } = await req.json()
  const itinerary = await generateItinerary(destination)
  
  return new Response(JSON.stringify(itinerary))
})
```

#### Option C: Express Backend

```typescript
// server/routes/itinerary.ts
app.post('/api/generate-itinerary', authenticateUser, async (req, res) => {
  const { destinationId } = req.body
  
  // Check rate limit
  // Generate itinerary
  // Return result
})
```

## Troubleshooting

### "API key not configured"

**Solution:**
1. Check `.env` file exists
2. Verify variable name: `VITE_OPENAI_API_KEY` or `VITE_ANTHROPIC_API_KEY`
3. Restart dev server: `npm run dev`

### "Failed to generate itinerary"

**Possible causes:**
1. Invalid API key
2. Insufficient credits/quota
3. Network error
4. Rate limit exceeded

**Debug steps:**
1. Check browser console for detailed error
2. Verify API key at provider's dashboard
3. Check account has available credits
4. Try mock generator: Remove API key temporarily

### Rate Limit Errors

**OpenAI:**
- Free tier: 3 requests/minute
- Paid tier: 3,500 requests/minute

**Anthropic:**
- Tier 1: 50 requests/minute
- Higher tiers: More capacity

**Solutions:**
1. Implement exponential backoff
2. Cache generated itineraries
3. Upgrade API tier
4. Use batch generation

### CORS Errors

**Issue:** Browser blocks API requests

**Solution:**
- OpenAI and Anthropic support CORS by default
- If issues persist, proxy through your backend
- Check browser console for specific CORS error

### Poor Quality Output

**Solutions:**
1. Improve the prompt with more specific instructions
2. Increase temperature for more creativity
3. Use a more capable model (GPT-4, Claude Opus)
4. Add few-shot examples to the prompt
5. Adjust max_tokens if output is truncated

## Advanced Features

### Multi-Language Support

Add language parameter:

```typescript
const prompt = `Generate itinerary in ${language}...`
```

### Personalization

Include user preferences:

```typescript
const prompt = `
User preferences:
- Budget: ${budget}
- Interests: ${interests.join(', ')}
- Dietary restrictions: ${dietary}
...
`
```

### PDF Export

Use a library like `jsPDF` or `react-pdf`:

```typescript
import { jsPDF } from 'jspdf'

const exportPDF = () => {
  const doc = new jsPDF()
  doc.text(itinerary.markdown, 10, 10)
  doc.save('itinerary.pdf')
}
```

### Email Itinerary

Integrate with email service:

```typescript
await fetch('/api/email-itinerary', {
  method: 'POST',
  body: JSON.stringify({
    email: user.email,
    itinerary: itinerary.markdown
  })
})
```

## Testing

### Unit Tests

```typescript
import { generateMockItinerary } from '@/lib/ai-itinerary'

test('generates valid itinerary structure', () => {
  const itinerary = generateMockItinerary(mockDestination)
  expect(itinerary.days).toHaveLength(3)
  expect(itinerary.markdown).toContain('Day 1')
})
```

### Integration Tests

```typescript
test('generates itinerary with OpenAI', async () => {
  const itinerary = await generateItinerary(mockDestination)
  expect(itinerary.markdown).toBeTruthy()
  expect(itinerary.days.length).toBeGreaterThan(0)
})
```

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [React Markdown Documentation](https://github.com/remarkjs/react-markdown)

---

**Need help?** Check the main README.md or open an issue in the repository.
