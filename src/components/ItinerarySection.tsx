import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Destination } from '@/types/database'
import { generateItinerary, generateMockItinerary, type Itinerary } from '@/lib/ai-itinerary'
import ReactMarkdown from 'react-markdown'

interface ItinerarySectionProps {
  destination: Destination
}

export default function ItinerarySection({ destination }: ItinerarySectionProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showItinerary, setShowItinerary] = useState(false)

  const handleGenerateItinerary = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if API key is configured
      const hasApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY

      let result: Itinerary

      if (hasApiKey) {
        // Use real AI generation
        result = await generateItinerary(destination)
      } else {
        // Use mock data for demo purposes
        console.warn('No AI API key configured. Using mock itinerary.')
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        result = generateMockItinerary(destination)
      }

      setItinerary(result)
      setShowItinerary(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary')
      console.error('Itinerary generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-8 md:p-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Hidden Gems & Local Flavors
          </h2>
          <p className="text-champagne-cream/70 text-lg">
            Discover the authentic soul of {destination.title} with our AI-curated
            3-day immersive itinerary.
          </p>
        </div>
      </div>

      {/* Generate Button */}
      {!itinerary && !loading && (
        <motion.button
          onClick={handleGenerateItinerary}
          disabled={loading}
          className="btn-primary w-full md:w-auto flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>Generate Your Personalized Itinerary</span>
        </motion.button>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-forest-mist/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-forest-mist border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-champagne-cream/70 text-lg mb-2">
            Crafting your immersive experience...
          </p>
          <p className="text-champagne-cream/50 text-sm">
            Our AI travel architect is curating hidden gems just for you
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-light border-2 border-red-400/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Generation Failed</h3>
              <p className="text-champagne-cream/70 text-sm">{error}</p>
              <button
                onClick={handleGenerateItinerary}
                className="mt-3 text-sm text-forest-mist hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Content */}
      <AnimatePresence>
        {showItinerary && itinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            {/* Markdown Content */}
            <div className="prose prose-invert prose-champagne max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-champagne-cream">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-6 text-champagne-cream">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-playfair text-2xl md:text-3xl font-semibold mt-8 mb-4 text-forest-mist">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-champagne-cream/80 text-base md:text-lg leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-champagne-cream font-semibold">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-champagne-cream/80 text-base md:text-lg">
                      {children}
                    </li>
                  ),
                  hr: () => (
                    <hr className="border-champagne-cream/20 my-8" />
                  ),
                }}
              >
                {itinerary.markdown}
              </ReactMarkdown>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-champagne-cream/20">
              <button
                onClick={handleGenerateItinerary}
                className="btn-glass flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Generate New Itinerary</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(itinerary.markdown)
                  alert('Itinerary copied to clipboard!')
                }}
                className="btn-glass flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy Itinerary</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      {!import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.VITE_ANTHROPIC_API_KEY && (
        <div className="mt-6 glass-light rounded-xl p-4 border border-champagne-cream/20">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-forest-mist flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="text-champagne-cream/70">
                <strong className="text-champagne-cream">Demo Mode:</strong> Using sample
                itinerary. To enable AI generation, add{' '}
                <code className="text-forest-mist">VITE_OPENAI_API_KEY</code> or{' '}
                <code className="text-forest-mist">VITE_ANTHROPIC_API_KEY</code> to your{' '}
                <code>.env</code> file.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
