import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { buttonClasses } from '../../utils/buttonClasses'
import { cn } from '../../utils/cn'
import { getWebGLCapability } from '../../utils/webgl'
import { ProductImage } from '../product/ProductImage'
import { prefetchProductViewer3D } from '../product/viewerLoader'
import { Container } from '../ui/Container'

interface Callout {
  label: string
  /** Points in the photo's 1000 × 667 coordinate space. */
  anchor: [number, number]
  elbow: [number, number]
  end: [number, number]
  side: 'left' | 'right'
}

/** Technical callouts over the Aura-500 Premium Plus product photo. */
const callouts: Callout[] = [
  { label: '8-LED light', anchor: [478, 150], elbow: [565, 112], end: [970, 112], side: 'right' },
  { label: 'Headrest', anchor: [262, 245], elbow: [215, 300], end: [30, 300], side: 'left' },
  { label: 'Movable spittoon', anchor: [478, 282], elbow: [600, 245], end: [970, 245], side: 'right' },
  { label: 'Memory foam', anchor: [338, 330], elbow: [255, 425], end: [30, 425], side: 'left' },
  { label: 'Mobile trolley', anchor: [690, 520], elbow: [780, 560], end: [970, 560], side: 'right' },
  { label: 'Chair base', anchor: [405, 540], elbow: [330, 595], end: [30, 595], side: 'left' },
]

const ease = [0.22, 1, 0.36, 1] as const
const headline = ['Designed', 'Around', 'Every', 'Move.']

export function HomeHero({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const variant = product.variants[0]

  const prefetch = () => {
    const capability = getWebGLCapability()
    if (capability.supported && !capability.constrained) prefetchProductViewer3D()
  }

  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="studio-backdrop relative overflow-hidden pt-16 lg:pt-[72px]">
      <Container className="relative grid items-center gap-6 pb-16 pt-4 sm:pb-20 sm:pt-10 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="relative z-10 lg:col-span-5">
          <m.p className="eyebrow flex items-center gap-3 text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease }}>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Precision. Comfort. Performance.
          </m.p>

          <h1 id="hero-title" className="mt-5 text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:mt-6 sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]">
            {headline.map((word, index) => (
              <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <m.span className="inline-block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, delay: 0.1 + index * 0.08, ease }}>
                  {word}
                  {index < headline.length - 1 && ' '}
                </m.span>
              </span>
            ))}
          </h1>

          <m.p
            className="mt-7 max-w-md text-[17px] leading-relaxed text-muted"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
          >
            Discover a thoughtfully engineered dental chair designed to support comfortable patient positioning, an efficient clinical workflow, and a
            modern dental practice.
          </m.p>

          <m.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
          >
            <Link to={`/dental-chairs/${product.slug}`} onPointerEnter={prefetch} onFocus={prefetch} className={buttonClasses('primary', 'lg')}>
              Explore the Chair
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" aria-hidden="true" />
            </Link>
          </m.div>

          <m.p className="mt-10 flex items-center gap-3 text-[13px] text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.8 }}>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-tech" aria-hidden="true" />
            <span>
              <span className="font-semibold text-ink">
                {product.name} {variant.name}
              </span>{' '}
              · {variant.label}
            </span>
          </m.p>
        </div>

        <m.div className="relative order-first lg:order-none lg:col-span-7" style={{ y: visualY }}>
          <m.div
            className="relative mx-auto aspect-[3/2] w-full max-w-[900px]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.15, ease }}
          >
            <ProductImage image={variant.image} fit="contain" blend priority sizes="(min-width: 1024px) 58vw, 100vw" />
            <HeroCallouts />
          </m.div>
        </m.div>
      </Container>
    </section>
  )
}

function HeroCallouts() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      <svg viewBox="0 0 1000 667" className="absolute inset-0 h-full w-full overflow-visible">
        {callouts.map((callout, index) => {
          const delay = 1.1 + index * 0.12
          const [ax, ay] = callout.anchor
          const [ex, ey] = callout.elbow
          const [lx, ly] = callout.end
          return (
            <g key={callout.label}>
              <m.path
                d={`M${ax} ${ay} L${ex} ${ey} L${lx} ${ly}`}
                fill="none"
                stroke="#202124"
                strokeOpacity="0.35"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay, ease }}
              />
              <m.circle
                cx={ax}
                cy={ay}
                r="5"
                fill="#FFFFFF"
                stroke="#4D9CB7"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: delay - 0.1, ease }}
                style={{ transformOrigin: `${ax}px ${ay}px` }}
              />
            </g>
          )
        })}
      </svg>
      {callouts.map((callout, index) => {
        const [lx, ly] = callout.end
        return (
          <m.span
            key={callout.label}
            className={cn(
              'absolute flex -translate-y-full items-baseline gap-2 whitespace-nowrap pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink',
              callout.side === 'right' && '-translate-x-full',
            )}
            style={{ left: `${lx / 10}%`, top: `${(ly / 667) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 + index * 0.12 }}
          >
            <span className="text-tech-ink">{String(index + 1).padStart(2, '0')}</span>
            {callout.label}
          </m.span>
        )
      })}
    </div>
  )
}
