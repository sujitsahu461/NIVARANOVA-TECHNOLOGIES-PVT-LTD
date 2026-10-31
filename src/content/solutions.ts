import type { Solution } from '../types'

/**
 * How NivaraNova approaches each kind of work. Written as approach and intent,
 * not as guaranteed outcomes: no packages, certifications or SLAs are offered.
 */
export const solutions: Solution[] = [
  {
    id: 'custom-software',
    title: 'Custom software development',
    summary: 'Software built around how your organisation actually works.',
    problem:
      'Off-the-shelf tools rarely match a specific process, so teams work around them with spreadsheets, messaging groups and paper registers.',
    approach:
      'Map the current workflow with the people who do it, agree a narrow first version, and build it in small, reviewed increments with automated tests. You receive the code and documentation.',
    technology: ['TypeScript', 'React', 'Python', 'Django', 'PostgreSQL'],
    value:
      'A system that fits the process, can be maintained after handover, and does not tie you to a single vendor.',
  },
  {
    id: 'web-mobile',
    title: 'Web and mobile application development',
    summary: 'Fast, accessible applications for browsers and phones.',
    problem:
      'Many public-facing services are hard to use on low-cost phones and slow connections, which shuts out the people who need them most.',
    approach:
      'Design for small screens first, keep pages light, support local languages, test with keyboard and screen readers, and build a native app with React Native only when it is justified.',
    technology: ['React', 'TypeScript', 'Vite', 'React Native', 'i18next'],
    value: 'Services that more people can use, on the devices they already own.',
  },
  {
    id: 'ai',
    title: 'AI-enabled digital solutions',
    summary: 'Machine learning used where it measurably helps.',
    problem:
      'AI is often added to software before there is data to evaluate it, which makes its results hard to trust or explain.',
    approach:
      'Start with a working rule-based system, collect labelled data from real use, then test whether a model beats that baseline. Models suggest; people decide.',
    technology: ['Python', 'scikit-learn', 'Held-out evaluation', 'Human review workflows'],
    value:
      'Automation you can measure and explain, introduced only when it improves on a simpler approach.',
  },
  {
    id: 'workflow-automation',
    title: 'Workflow automation',
    summary: 'Fewer manual hand-offs between people and departments.',
    problem:
      'Requests get lost between inboxes, phone calls and registers. Nobody can see who holds a task or how long it has been waiting.',
    approach:
      'Model the workflow explicitly, with its states, owners and routing rules, and record every change so that delays are visible.',
    technology: ['Django REST Framework', 'PostgreSQL', 'Role-based access', 'Audit logging'],
    value: 'Clear ownership of each task, and a record of what happened, when and by whom.',
  },
  {
    id: 'digital-transformation',
    title: 'Digital transformation',
    summary: 'Moving paper and phone processes online, one process at a time.',
    problem:
      'Large digitisation projects often try to replace everything at once and stall before anyone benefits.',
    approach:
      'Pick one high-volume process, digitise it end to end, compare the result with the old process, then move to the next one.',
    technology: ['Process mapping', 'Data migration', 'PostgreSQL', 'Staff guides'],
    value: 'Visible improvement early, with each further step justified by results.',
  },
  {
    id: 'consulting',
    title: 'Technology consulting',
    summary: 'Independent advice on architecture, hosting and running costs.',
    problem:
      'Small organisations are often sold infrastructure sized for far more users than they have, and then pay for it every month.',
    approach:
      'Review what you have, estimate the real load, and recommend the simplest architecture that meets it, with the costs written down.',
    technology: ['Architecture review', 'Cost estimation', 'Security baseline', 'PostgreSQL'],
    value: 'Decisions you can explain to your finance team, on infrastructure that fits your budget.',
  },
]
