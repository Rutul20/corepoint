import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { buttonClasses } from '../utils/buttonClasses'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70svh] items-center pb-24 pt-32">
      <Container className="max-w-2xl text-center">
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">This page could not be found.</h1>
        <p className="mt-5 text-lg text-muted">The link may be out of date, or the page may have moved.</p>
        <Link to="/" className={buttonClasses('primary', 'lg', 'mt-10')}>
          Back to the product <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Container>
    </section>
  )
}
