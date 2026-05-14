# AI Itinerary Generator

This module provides AI-powered itinerary generation for the Immersive Travel application.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 or Anthropic Claude to create personalized itineraries
- **Sensory-Rich Content**: Focuses on sounds, smells, and sights for immersive experiences
- **Technical Tips**: Includes practical advice for photographers and travelers
- **3-Day Format**: Structured breakdown with daily activities
- **Mock Mode**: Works without API keys for development/demo

## Setup

### Option 1: OpenAI (GPT-4)

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to your `.env` file:
```env
VITE_OPENAI_API_KEY=sk-...your-key-here
```

### Option 2: Anthropic (Claude)

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to your `.env` file:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-...your-key-here
```

### Option 3: Demo Mode (No API Key)

If no API key is configured, the app will automatically use mock itineraries. Perfect for:
- Development and testing
- Demos and presentations
- Trying out the UI before committing to an API

## Usage

The `ItinerarySection` component automatically handles:
- API key detection
- Loading states
- Error handling
- Markdown rendering
- Copy to clipboard functionality

```tsx
import ItinerarySection from '@/components/ItinerarySection'

<ItinerarySection destination={destination} />
```

## API Functions

### `generateItinerary(destination: Destination): Promise<Itinerary>`

Generates an itinerary using OpenAI GPT-4.

**Parameters:**
- `destination`: Destination object with title, location, category, description

**Returns:**
- `Itinerary` object with markdown content and structured day data

**Throws:**
- Error if API key is not configured
- Error if API request fails

### `generateItineraryWithClaude(destination: Destination): Promise<Itinerary>`

Alternative implementation using Anthropic Claude.

### `generateMockItinerary(destination: Destination): Itinerary`

Generates a mock itinerary for development/demo purposes. No API key required.

## Prompt Engineering

The prompt is carefully crafted to:
1. Provide context about the destination
2. Request sensory-rich descriptions
3. Include technical tips for travelers
4. Format output as structured Markdown
5. Match the "Immersive" brand voice

See `generatePrompt()` function in `ai-itinerary.ts` for details.

## Output Format

The AI generates Markdown in this structure:

```markdown
# Hidden Gems & Local Flavors
## [Destination Name]

### Day 1: [Evocative Title]
[Activities with sensory details]

**Technical Tip:** [Practical advice]

**Sensory Highlights:**
- 🔊 Sounds: [What you'll hear]
- 👃 Smells: [What you'll smell]
- 👁️ Sights: [What you'll see]

---

### Day 2: [Title]
[Same structure]

---

### Day 3: [Title]
[Same structure]

---

**Pro Tip:** [Final insider advice]
```

## Customization

### Changing the AI Model

Edit `ai-itinerary.ts`:

```typescript
// For OpenAI
model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for lower cost

// For Anthropic
model: 'claude-3-opus-20240229', // or 'claude-3-sonnet-20240229'
```

### Adjusting Temperature

Higher temperature = more creative, lower = more consistent:

```typescript
temperature: 0.8, // Range: 0.0 to 1.0
```

### Modifying the Prompt

Edit the `generatePrompt()` function to:
- Change the number of days
- Add different sections (food, accommodation, etc.)
- Adjust the tone and style
- Include additional destination data

### Adding More AI Providers

To add support for other AI providers (Google Gemini, Cohere, etc.):

1. Create a new function: `generateItineraryWith[Provider]()`
2. Follow the same interface: `(destination: Destination) => Promise<Itinerary>`
3. Update the `ItinerarySection` component to detect the new API key

## Cost Considerations

### OpenAI GPT-4
- ~$0.03 per itinerary (2000 tokens)
- Use GPT-3.5-turbo for ~$0.002 per itinerary

### Anthropic Claude
- ~$0.015 per itinerary (Claude 3 Sonnet)
- Claude 3 Haiku: ~$0.0025 per itinerary

### Optimization Tips
1. Cache generated itineraries in Supabase
2. Implement rate limiting
3. Use cheaper models for development
4. Consider batch generation for multiple destinations

## Caching Strategy (Optional)

To avoid regenerating the same itinerary:

1. Add an `itineraries` table to Supabase:
```sql
CREATE TABLE itineraries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  destination_id UUID REFERENCES destinations(id),
  markdown TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(destination_id)
);
```

2. Check cache before calling AI:
```typescript
// Check if itinerary exists
const { data } = await supabase
  .from('itineraries')
  .select('markdown')
  .eq('destination_id', destination.id)
  .single()

if (data) {
  return { markdown: data.markdown, ... }
}

// Generate new itinerary
const itinerary = await generateItinerary(destination)

// Cache it
await supabase
  .from('itineraries')
  .insert({ destination_id: destination.id, markdown: itinerary.markdown })
```

## Troubleshooting

### "API key not configured"
- Ensure `.env` file exists
- Check variable name: `VITE_OPENAI_API_KEY` or `VITE_ANTHROPIC_API_KEY`
- Restart dev server after adding API key

### "Failed to generate itinerary"
- Check API key is valid
- Verify you have credits/quota remaining
- Check browser console for detailed error
- Try the mock generator to test UI

### Rate Limit Errors
- Implement exponential backoff
- Add user-facing rate limit messaging
- Consider caching strategy above

### CORS Errors
- API calls are made from client-side
- OpenAI and Anthropic APIs support CORS
- For production, consider proxying through your backend

## Security Notes

⚠️ **Important**: API keys in `.env` are exposed in the client bundle!

For production:
1. Move AI generation to a backend API route
2. Use environment variables on the server
3. Implement authentication and rate limiting
4. Never commit `.env` to version control

Example backend route (Next.js):
```typescript
// pages/api/generate-itinerary.ts
export default async function handler(req, res) {
  // Verify user is authenticated
  // Call AI API with server-side key
  // Return result
}
```

## Future Enhancements

- [ ] Multi-language support
- [ ] Customizable itinerary length (2-7 days)
- [ ] Dietary preferences and accessibility options
- [ ] Budget-based recommendations
- [ ] Integration with booking platforms
- [ ] PDF export functionality
- [ ] Social sharing features
