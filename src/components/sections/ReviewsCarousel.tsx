'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

const R2_BASE = 'https://pub-1972d57ee4d5423d824c280f20c21211.r2.dev/Reviews'
const REVIEW_IMAGES: string[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `${R2_BASE}/${n}.jpeg`)

interface ReviewsCarouselProps {
  showHint?: boolean
}

export default function ReviewsCarousel({ showHint = false }: ReviewsCarouselProps = {}) {
  if (!REVIEW_IMAGES || REVIEW_IMAGES.length === 0) {
    return null
  }

  const trackRef = useRef<HTMLDivElement>(null)
  const slideButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const [visibleSlides, setVisibleSlides] = useState(3)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const updateVisibleSlides = useCallback(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 1024) {
      setVisibleSlides(3)
    } else if (window.innerWidth >= 640) {
      setVisibleSlides(2)
    } else {
      setVisibleSlides(1)
    }
  }, [])

  const maxIndex = Math.max(0, REVIEW_IMAGES.length - visibleSlides)

  const getSlideStep = useCallback(() => {
    const track = trackRef.current
    if (!track || track.children.length < 2) {
      return track?.clientWidth || 300
    }
    const first = track.children[0] as HTMLElement
    const second = track.children[1] as HTMLElement
    return second.offsetLeft - first.offsetLeft
  }, [])

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const { scrollLeft, scrollWidth, clientWidth } = track
    const maxScrollLeft = scrollWidth - clientWidth
    const isAtStart = scrollLeft <= 8
    const isAtEnd = maxScrollLeft <= 0 || scrollLeft >= maxScrollLeft - 8

    const step = getSlideStep()
    let currentIndex = 0
    if (step > 0) {
      currentIndex = Math.round(scrollLeft / step)
    }
    if (isAtEnd) {
      currentIndex = maxIndex
    } else if (isAtStart) {
      currentIndex = 0
    }

    const clampedIndex = Math.max(0, Math.min(maxIndex, currentIndex))
    setActiveIndex(clampedIndex)
    setCanScrollLeft(!isAtStart && clampedIndex > 0)
    setCanScrollRight(!isAtEnd && clampedIndex < maxIndex)
  }, [getSlideStep, maxIndex])

  useEffect(() => {
    updateVisibleSlides()
    updateScrollState()
    const handleResize = () => {
      updateVisibleSlides()
      updateScrollState()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateVisibleSlides, updateScrollState])

  const handleScrollToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(maxIndex, index))
    if (!track.children[clamped]) return
    const target = track.children[clamped] as HTMLElement
    setActiveIndex(clamped)
    setCanScrollLeft(clamped > 0)
    setCanScrollRight(clamped < maxIndex)
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    })
  }

  const handleScrollBySlide = (direction: 'prev' | 'next') => {
    const targetIndex =
      direction === 'next'
        ? Math.min(maxIndex, activeIndex + 1)
        : Math.max(0, activeIndex - 1)
    handleScrollToSlide(targetIndex)
  }

  // Lightbox open / close
  const openLightbox = (index: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    setTimeout(() => {
      lastFocusedRef.current?.focus()
    }, 50)
  }, [])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [lightboxIndex])

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : REVIEW_IMAGES.length - 1))
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < REVIEW_IMAGES.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox])

  return (
    <section
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 10% 20%, rgba(107,78,255,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(107,78,255,0.06) 0%, transparent 55%), #07091A',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient subtle background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {/* Small pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(107, 78, 255, 0.15)',
              border: '1px solid rgba(107, 78, 255, 0.35)',
              color: '#A78BFA',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '16px',
            }}
          >
            ✓ Verified Reviews
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              lineHeight: 1.15,
              margin: '0 0 12px',
            }}
          >
            What Our{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, var(--color-primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Customers Say
            </span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: 'var(--color-on-dark-muted)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Real feedback from real customers.
          </p>
        </div>

        {/* Carousel with Side Arrow Buttons */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScrollBySlide('prev')}
            disabled={!canScrollLeft}
            aria-label="Previous reviews"
            className="reviews-nav-btn reviews-nav-prev"
            style={{
              position: 'absolute',
              left: '-18px',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(17, 22, 37, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              opacity: canScrollLeft ? 1 : 0.3,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Scrollable Track */}
          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="reviews-carousel-track"
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '8px 4px 16px',
            }}
          >
            {REVIEW_IMAGES.map((src, index) => (
              <button
                key={index}
                ref={(el) => {
                  slideButtonRefs.current[index] = el
                }}
                type="button"
                onClick={() => openLightbox(index)}
                aria-label={`View full size review screenshot ${index + 1}`}
                className="reviews-carousel-slide"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  background: '#141B2D',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  aspectRatio: '3 / 4',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  cursor: 'zoom-in',
                  textAlign: 'left',
                }}
              >
                {/* Review image with 3:4 portrait contain */}
                <img
                  src={src}
                  alt={`Customer review screenshot ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={640}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '6px',
                    pointerEvents: 'none',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScrollBySlide('next')}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className="reviews-nav-btn reviews-nav-next"
            style={{
              position: 'absolute',
              right: '-18px',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(17, 22, 37, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              opacity: canScrollRight ? 1 : 0.3,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Clickable Dot Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
          }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, i) => {
            const isActive = activeIndex === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleScrollToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  border: 'none',
                  padding: 0,
                  background: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.22)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            )
          })}
        </div>

        {/* Helper Line (visible only when showHint is true) */}
        {showHint && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--color-on-dark-muted, rgba(255, 255, 255, 0.6))',
              fontFamily: 'var(--font-sans)',
              marginTop: '16px',
              marginBottom: 0,
            }}
          >
            Tap a screenshot to enlarge.
          </p>
        )}
      </div>

      {/* Lightbox Modal Dialog */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review screenshot viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox()
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(3, 4, 12, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Close X Button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close viewer"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 100001,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev Arrow in Lightbox */}
          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : REVIEW_IMAGES.length - 1
              )
            }
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '20px',
              zIndex: 100001,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Active Image Container */}
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={REVIEW_IMAGES[lightboxIndex]}
              alt={`Customer review screenshot ${lightboxIndex + 1}`}
              decoding="async"
              style={{
                maxWidth: '90vw',
                maxHeight: '86vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />

            {/* Image Counter */}
            <div
              style={{
                marginTop: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              {lightboxIndex + 1} / {REVIEW_IMAGES.length}
            </div>
          </div>

          {/* Next Arrow in Lightbox */}
          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev < REVIEW_IMAGES.length - 1 ? prev + 1 : 0
              )
            }
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '20px',
              zIndex: 100001,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
