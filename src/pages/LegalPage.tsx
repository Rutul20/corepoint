import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <section className="pb-24 pt-32 lg:pt-40">
      <Container className="max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{title}</h1>
        <div className="mt-10 space-y-5 text-base leading-relaxed text-ink-soft">{children}</div>
      </Container>
    </section>
  )
}
