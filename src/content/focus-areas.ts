import { Blocks, BrainCircuit, Building2, Code2, Workflow } from 'lucide-react'
import type { FocusArea } from '../types'

/**
 * Areas of focus. These describe where the company is building capability;
 * they are not a list of services on sale. The home page places exactly five
 * of them on a ring (.focus-orbit in src/styles/index.css): change both together.
 * Keep each detail to one short line, so the ring stays light.
 */
export const focusAreas: FocusArea[] = [
  {
    title: 'Software engineering',
    icon: Code2,
    detail: 'Well-structured software that is easy to run and to change.',
  },
  {
    title: 'Digital product development',
    icon: Blocks,
    detail: 'Turning a real workflow into a simple, usable product.',
  },
  {
    title: 'AI-enabled applications',
    icon: BrainCircuit,
    detail: 'Machine learning where it measurably helps, with a person accountable.',
  },
  {
    title: 'Intelligent platforms',
    icon: Workflow,
    detail: 'Systems that route, track and report on work.',
  },
  {
    title: 'Enterprise technology solutions',
    icon: Building2,
    detail: 'Software for organisations with several departments and roles.',
  },
]
