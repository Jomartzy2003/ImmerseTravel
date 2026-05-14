import { motion } from 'framer-motion'
import { useDestinations } from '@/hooks/useDestinations'
import ParallaxHero from '@/components/ParallaxHero'
import DestinationCard from '@/components/DestinationCard'

export default function HomePage() {
  const { destinations, loading } = useDestinations()
  const featuredDestination = destinations.find((d) => d.featured) || destinations[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-forest-mist border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-champagne-cream/70">Loading destinations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      {featuredDestination && (
        <ParallaxHero destination={featuredDestination}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-champagne-cream/90 text-lg md:text-xl max-w-2xl mx-auto">
              {featuredDestination.description}
            </p>
          </motion.div>
        </ParallaxHero>
      )}

      {/* Destinations Grid */}
      <section className="relative z-10 bg-charcoal py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-display mb-4">Explore Destinations</h2>
            <p className="text-champagne-cream/70 text-lg max-w-2xl mx-auto">
              Curated experiences from around the world. Each destination tells a story,
              waiting for you to become part of it.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
              />
            ))}
          </div>

          {/* Empty State */}
          {destinations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-champagne-cream/50 text-lg">
                No destinations available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 bg-gradient-to-b from-charcoal to-charcoal/50 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-playfair text-5xl md:text-6xl font-bold mb-6">
            Your Journey Begins Here
          </h2>
          <p className="text-champagne-cream/70 text-lg mb-8 max-w-2xl mx-auto">
            Sign in to save your favorite destinations and create your personalized
            travel collection. Adventure awaits.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
