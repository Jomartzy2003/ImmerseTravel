import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Destination } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxHeroProps {
  destination: Destination
  children?: React.ReactNode
}

/**
 * The 'Sandwich' Parallax Engine
 * 
 * Creates a high-end 3D depth effect with three layers:
 * - Layer 1 (z=0): Background image at 0.2x scroll velocity
 * - Layer 2 (z=10): Large typography at 0.6x scroll velocity
 * - Layer 3 (z=20): Foreground cutout at 1.1x scroll velocity
 * 
 * The foreground layer covers the bottom of the text to create
 * the 'hidden' or 'peeking' effect.
 */
export default function ParallaxHero({ destination, children }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgLayerRef = useRef<HTMLDivElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const fgLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Layer 1: Background - slowest movement (0.2x)
      gsap.to(bgLayerRef.current, {
        y: () => window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Layer 2: Text - medium movement (0.6x)
      gsap.to(textLayerRef.current, {
        y: () => window.innerHeight * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Layer 3: Foreground - fastest movement (1.1x)
      gsap.to(fgLayerRef.current, {
        y: () => window.innerHeight * 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Fade out entire hero on scroll
      gsap.to(containerRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [destination])

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Layer 1: Background Image (z=0, velocity=0.2x) */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 w-full h-[120vh]"
        style={{
          willChange: 'transform',
          zIndex: 0,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${destination.bg_layer_url})`,
            filter: 'brightness(0.7)',
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      </div>

      {/* Layer 2: Typography (z=10, velocity=0.6x) */}
      <div
        ref={textLayerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          willChange: 'transform',
          zIndex: 10,
        }}
      >
        <h1 className="text-hero text-center px-8 max-w-6xl">
          {destination.title}
        </h1>
      </div>

      {/* Layer 3: Foreground Cutout (z=20, velocity=1.1x) */}
      <div
        ref={fgLayerRef}
        className="absolute inset-0 w-full h-[120vh] pointer-events-none"
        style={{
          willChange: 'transform',
          zIndex: 20,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${destination.fg_layer_url})`,
            backgroundPosition: 'center bottom',
            mixBlendMode: 'normal',
          }}
        />
      </div>

      {/* Optional children content */}
      {children && (
        <div className="absolute bottom-12 left-0 right-0 z-30 px-8">
          {children}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-champagne-cream/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-champagne-cream/50 rounded-full" />
        </div>
      </div>
    </div>
  )
}
