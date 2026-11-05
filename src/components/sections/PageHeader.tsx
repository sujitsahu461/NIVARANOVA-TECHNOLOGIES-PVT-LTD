import type { ReactNode } from 'react'
import { Container } from '../ui/Container'

interface PageHeaderProps {
  title: string
  lead: string
  children?: ReactNode
}

/** Opening block for inner pages: one h1 and a lead paragraph. */
export function PageHeader({ title, lead, children }: PageHeaderProps) {
  return (
    <section className="aurora border-b border-line bg-paper">
      <Container className="pt-16 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
        <h1 className="max-w-3xl text-h1">{title}</h1>
        <p className="mt-6 max-w-prose text-lead text-muted">{lead}</p>
        {children}
      </Container>
    </section>
  )
}
