import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSavedDestinations } from '@/hooks/useDestinations'
import type { Destination } from '@/types/database'

interface DestinationCardProps {
  destination: Destination
  index: number
}

export default function DestinationCard({ destination, index }: DestinationCardProps) {
  const { toggleSave, isSaved } = useSavedDestinations()
  const saved = isSaved(destination.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl aspect-[4/5] glass"
    >
      <Link to={`/destination/${destination.id}`} className="block h-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${destination.bg_layer_url})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Category Badge */}
          {destination.category && (
            <div className="self-start">
              <span className="glass-light px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider">
                {destination.category}
              </span>
            </div>
          )}

          {/* Bottom Content */}
          <div>
            <h3 className="font-playfair text-3xl font-bold mb-2 group-hover:text-forest-mist transition-colors">
              {destination.title}
            </h3>
            {destination.location && (
              <p className="text-champagne-cream/70 text-sm mb-4">
                📍 {destination.location}, {destination.country}
              </p>
            )}
            <p className="text-champagne-cream/80 text-sm line-clamp-2">
              {destination.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Save Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          toggleSave(destination.id)
        }}
        className="absolute top-6 right-6 z-10 w-12 h-12 glass-light rounded-full flex items-center justify-center hover:bg-champagne-cream/30 transition-all hover:scale-110 active:scale-95"
      >
        <svg
          className={`w-6 h-6 transition-colors ${
            saved ? 'fill-forest-mist text-forest-mist' : 'fill-none text-champagne-cream'
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
      </button>
    </motion.div>
  )
}
