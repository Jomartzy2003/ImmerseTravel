import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSavedDestinations } from '@/hooks/useDestinations'
import DestinationCard from '@/components/DestinationCard'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function SavedPage() {
  const { user } = useAuth()
  const { savedDestinations, loading } = useSavedDestinations()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loading) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-forest-mist border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-champagne-cream/70">Loading your saved adventures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-display mb-4">Saved Adventures</h1>
          <p className="text-champagne-cream/70 text-lg">
            Your personal collection of dream destinations. {savedDestinations.length}{' '}
            {savedDestinations.length === 1 ? 'place' : 'places'} saved.
          </p>
        </motion.div>

        {/* Grid */}
        {savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🗺️</div>
              <h2 className="font-playfair text-3xl font-bold mb-4">
                No Saved Destinations Yet
              </h2>
              <p className="text-champagne-cream/70 mb-8">
                Start exploring and save your favorite destinations to build your dream
                travel collection.
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Explore Destinations
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
