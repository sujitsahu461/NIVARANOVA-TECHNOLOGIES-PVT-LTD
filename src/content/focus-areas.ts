import { Blocks, BrainCircuit, Building2, Code2, Workflow } from 'lucide-react'
import type { FocusArea } from '../types'

/**
 * Areas of focus. These describe where the company is building capability;
 * they are not a list of services on sale.
 */
export const focusAreas: FocusArea[] = [
  {
    title: 'Software engineering',
    icon: Code2,
    detail:
      'Well-structured software that is straightforward to run and to change. Typed code, automated tests and documentation are part of the work, not extras.',
  },
  {
    title: 'Digital product development',
    icon: Blocks,
    detail:
      'Turning a real workflow into a usable product: learning who does what today, then designing the smallest version that makes it better.',
  },
  {
    title: 'AI-enabled applications',
    icon: BrainCircuit,
    detail:
      'Machine learning where it measurably helps, such as suggesting a category or spotting duplicates, with a person accountable for every decision.',
  },
  {
    title: 'Intelligent platforms',
    icon: Workflow,
    detail:
      'Systems that route, track and report on work: clear rules, queues, status histories and views that show where things are getting stuck.',
  },
  {
    title: 'Enterprise technology solutions',
    icon: Building2,
    detail:
      'Software for organisations with several departments, roles and approval paths, with role-based access, audit trails and room to integrate.',
  },
]
