import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'
import { supabase } from '@/lib/supabase'

  
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // window.location.origin dynamically detects if you're on http://localhost:5173
          // or https://immerse-travel.vercel.app and routes back automatically!
          redirectTo: window.location.origin 
        }
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message)
      alert('Authentication failed. Please try again.')
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="p-8 bg-charcoal/50 backdrop-blur-md rounded-xl border border-champagne-cream/10 text-center">
        <h2 className="text-2xl font-bold text-champagne-cream mb-6">Welcome to Vivid Horizons</h2>
        
        {/* Attach the handler to your button here */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-champagne-cream transition-colors duration-200"
        >
          {/* Optional: Add a Google Icon SVG here */}
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-forest-mist rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-charcoal font-bold text-xl">✈</span>
            </div>
            <span className="font-playfair text-2xl font-bold text-champagne-cream">
              Immersive
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-forest-mist'
                  : 'text-champagne-cream/70 hover:text-champagne-cream'
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link
                to="/saved"
                className={`text-sm font-medium transition-colors ${
                  isActive('/saved')
                    ? 'text-forest-mist'
                    : 'text-champagne-cream/70 hover:text-champagne-cream'
                }`}
              >
                Saved Adventures
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 glass-light px-4 py-2 rounded-full hover:bg-champagne-cream/20 transition-colors"
                >
                  <img
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}`}
                    alt={profile?.full_name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium hidden sm:block">
                    {profile?.full_name || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden"
                    >
                      <Link
                        to="/saved"
                        className="block px-4 py-3 text-sm hover:bg-champagne-cream/10 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Saved Adventures
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-champagne-cream/10 transition-colors text-red-400"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-glass text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
