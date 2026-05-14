import Navbar from '@/components/Navbar'
import { useLenis } from '@/hooks/useLenis'
import DestinationDetailPage from '@/pages/DestinationDetailPage'
import HomePage from '@/pages/HomePage'
import SavedPage from '@/pages/SavedPage'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom' // Added useLocation

function App() {
  // Initialize Lenis smooth scrolling
  useLenis()
  
  // This hook is required for AnimatePresence to work with Routes
  const location = useLocation()

  return (
    <div className="min-h-screen bg-charcoal relative overflow-x-hidden">
      {/* 1. THE MESH BACKGROUND (The "Atmosphere") */}
      <div className="mesh-bg" /> 

      {/* 2. NAVIGATION (Stays on top of the background) */}
      <Navbar />
      
      {/* 3. THE PAGE CONTENT (With smooth transitions) */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/destination/:id" element={<DestinationDetailPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App