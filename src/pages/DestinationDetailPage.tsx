import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDestination, useSavedDestinations } from '@/hooks/useDestinations'
import ParallaxHero from '@/components/ParallaxHero'
import ItinerarySection from '@/components/ItinerarySection'

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { destination, loading } = useDestination(id!)
  const { toggleSave, isSaved } = useSavedDestinations()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-forest-mist border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-champagne-cream/70">Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Destination Not Found</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const saved = isSaved(destination.id)

  return (
    <div className="min-h-screen">
      {/* Parallax Hero */}
      <ParallaxHero destination={destination}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-between max-w-4xl mx-auto"
        >
          <div>
            {destination.location && (
              <p className="text-champagne-cream/90 text-lg mb-2">
                📍 {destination.location}, {destination.country}
              </p>
            )}
          </div>
          <button
            onClick={() => toggleSave(destination.id)}
            className="btn-glass flex items-center space-x-2"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                saved ? 'fill-forest-mist text-forest-mist' : 'fill-none'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </motion.div>
      </ParallaxHero>

      {/* Content Section */}
      <section className="relative z-10 bg-charcoal py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Category */}
            {destination.category && (
              <div className="mb-8">
                <span className="glass-light px-6 py-3 rounded-full text-sm font-medium uppercase tracking-wider">
                  {destination.category}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="glass rounded-3xl p-12 mb-12">
              <h2 className="font-playfair text-4xl font-bold mb-6">About This Destination</h2>
              <p className="text-body text-champagne-cream/80 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="glass rounded-2xl p-8">
                <h3 className="font-playfair text-2xl font-semibold mb-4">Location</h3>
                <p className="text-champagne-cream/80">
                  {destination.location}
                  <br />
                  {destination.country}
                </p>
              </div>

              <div className="glass rounded-2xl p-8">
                <h3 className="font-playfair text-2xl font-semibold mb-4">Category</h3>
                <p className="text-champagne-cream/80 capitalize">
                  {destination.category || 'Adventure'}
                </p>
              </div>
            </div>

            {/* AI-Generated Itinerary Section */}
            <div className="mb-12">
              <ItinerarySection destination={destination} />
            </div>

            {/* Call to Action */}
            <div className="glass rounded-3xl p-12 text-center">
              <h2 className="font-playfair text-3xl font-bold mb-4">
                Ready to Explore?
              </h2>
              <p className="text-champagne-cream/70 mb-8 max-w-2xl mx-auto">
                Start planning your journey to {destination.title}. Save this destination
                and discover more incredible places around the world.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => toggleSave(destination.id)}
                  className="btn-primary"
                >
                  {saved ? '✓ Saved' : 'Save Destination'}
                </button>
                <button onClick={() => navigate('/')} className="btn-glass">
                  Explore More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
