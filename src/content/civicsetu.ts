import type { Capability, CapabilityStatus, WorkflowStep } from '../types'

/**
 * CivicSetu product content.
 *
 * Status discipline: every capability records the evidence for its status.
 * Sources referenced below:
 *   [REQ]   Product requirements (master context, 30 Oct 2026)
 *   [WDR]   Work-Done Report, 13 Oct 2026 (static review of the V1 codebase)
 *   [TEST]  V1 test report: 221 backend tests passing, plus 9 complaint tests
 *           covering multimedia, Unicode and permissions (reported, not re-run)
 *   [DEC]   V1 decision, Oct 2026: no ML in the complaint path
 *   [PLAN]  Execution roadmap
 * Upgrade a status only when new evidence exists, and update `evidence` too.
 */

export const civicSetuStatus = [
  { label: 'Stage', value: 'Version 1 in development, under internal testing' },
  { label: 'Deployment', value: 'Not deployed. There is no live service yet.' },
  { label: 'Pilots', value: 'None yet. We are looking for a first pilot partner.' },
  { label: 'Interface languages', value: 'English, Odia and Hindi' },
] as const

export const civicSetuSummary =
  'A civic grievance management platform that connects citizens with the departments responsible for fixing problems, and keeps a record of every step.'

export const civicSetuOverview = [
  'CivicSetu handles one workflow end to end: a public complaint, from the moment a citizen reports it to the moment they confirm it has been fixed.',
  'Citizens report problems such as damaged roads, water supply failures, blocked drains or faulty streetlights, with photos and the exact location. Each complaint goes to the department responsible for it, where officers update its status and record what was done. Administrators can see the whole picture through the audit log.',
]

export const civicSetuProblem = [
  'In many towns, civic complaints still arrive by phone, at a counter, on paper or in messaging groups. They are hard to route to the right department and hard to follow up.',
  'The person who reported the problem rarely hears what happened to it, and without a shared record it is difficult for anyone to see where complaints get stuck.',
]

export const civicSetuSolution = [
  'CivicSetu gives every complaint a single record from the moment it is reported. The citizen chooses a category and attaches evidence, and a fixed mapping sends it to the responsible department.',
  'Officers act on the complaint and update its status. The citizen follows progress with a tracking code and says whether the problem was actually fixed. Every change is logged.',
]

export const complaintCategories = ['Roads', 'Water supply', 'Electricity', 'Drainage', 'Sanitation'] as const

export const citizenWorkflow: WorkflowStep[] = [
  { title: 'Sign in', detail: 'Create an account and sign in.' },
  {
    title: 'Report the problem',
    detail: 'Choose a category, describe the issue and mark where it is.',
  },
  { title: 'Attach evidence', detail: 'Add photos, a voice note or a short video.' },
  {
    title: 'Track progress',
    detail: 'Use the tracking code to see the current status and every action taken so far.',
  },
  {
    title: 'Confirm the outcome',
    detail: 'Once the complaint is closed, say whether the problem was actually fixed.',
  },
]

export const authorityWorkflow: WorkflowStep[] = [
  {
    title: 'Open the department queue',
    detail: 'Officers see only the complaints routed to their own department.',
  },
  { title: 'Assign', detail: 'Give each complaint to the person responsible for acting on it.' },
  {
    title: 'Act and update',
    detail: 'Move the complaint through its statuses, with a note at each step.',
  },
  {
    title: 'Resolve',
    detail: 'Close the complaint with a resolution note the citizen can read.',
  },
  {
    title: 'Review',
    detail: 'Administrators manage departments, users and routing rules, and review the audit log.',
  },
]

/** Short form of the workflow, used on the home page. */
export const lifecycle: WorkflowStep[] = [
  { title: 'Report', detail: 'A citizen reports the problem with evidence and location.' },
  { title: 'Route', detail: 'The category decides which department receives it.' },
  { title: 'Assign', detail: 'The department gives it to a responsible officer.' },
  { title: 'Act', detail: 'The officer updates its status and records what was done.' },
  { title: 'Resolve', detail: 'The citizen sees the outcome and confirms whether it is fixed.' },
]

export const capabilities: Capability[] = [
  {
    name: 'Complaint submission',
    detail: 'Category, description and location recorded for every complaint.',
    status: 'tested',
    evidence: '[TEST] complaint tests; [REQ] categories and location',
  },
  {
    name: 'Photo, audio and video evidence',
    detail: 'Photos, voice notes and short videos attached to a complaint, with size limits.',
    status: 'tested',
    evidence: '[TEST] multimedia complaint tests; [WDR] ComplaintAttachment IMAGE/AUDIO/VIDEO',
  },
  {
    name: 'Role-based access',
    detail:
      'Citizens see their own complaints, officers see their department’s queue, and administrators manage the system.',
    status: 'tested',
    evidence: '[TEST] permission tests; [REQ] roles',
  },
  {
    name: 'Citizen registration and sign-in',
    detail: 'Personal accounts with token-based authentication.',
    status: 'implemented',
    evidence: '[WDR] accounts module, Django REST Framework + Simple JWT',
  },
  {
    name: 'Tracking code and complaint history',
    detail: 'A code to follow each complaint, with a timeline of status changes and notes.',
    status: 'implemented',
    evidence: '[REQ] tracking code, history; [WDR] complaints module',
  },
  {
    name: 'Routing to departments',
    detail: 'A fixed category-to-department map sends each complaint to the right team.',
    status: 'implemented',
    evidence: '[DEC] category to department map; [WDR] departments module',
  },
  {
    name: 'Rule-based priority',
    detail: 'Priority set by clear, predictable rules rather than a model.',
    status: 'implemented',
    evidence: '[DEC] deterministic priority',
  },
  {
    name: 'Officer workflow',
    detail: 'Department queue, assignment, status updates and resolution notes.',
    status: 'implemented',
    evidence: '[REQ] authority role; [WDR] authority workflow module',
  },
  {
    name: 'Citizen feedback',
    detail: 'Citizens say whether a resolved complaint was actually fixed.',
    status: 'implemented',
    evidence: '[REQ] feedback; [WDR] feedback module',
  },
  {
    name: 'Administration and audit log',
    detail: 'Manage users, roles, departments and routing; every change is recorded.',
    status: 'implemented',
    evidence: '[REQ] super admin role; [WDR] audit logs module',
  },
  {
    name: 'English, Odia and Hindi',
    detail: 'The interface is available in three languages.',
    status: 'implemented',
    evidence: '[WDR] I18N_IMPLEMENTATION.md, i18next',
  },
  {
    name: 'Email and SMS notifications',
    detail: 'Alerts to citizens and officers when a complaint changes status.',
    status: 'planned',
    evidence: '[PLAN] SMTP and MSG91 listed as planned',
  },
  {
    name: 'AI-assisted categorisation and priority',
    detail:
      'Suggestions only, checked by a person, and introduced after evaluation on real complaint data.',
    status: 'planned',
    evidence: '[DEC] no ML in V1; [PLAN] advisory AI later',
  },
  {
    name: 'Mobile app',
    detail: 'A React Native app for citizens.',
    status: 'planned',
    evidence: '[PLAN] React Native client, not started',
  },
  {
    name: 'Reports and analytics',
    detail: 'Resolution times and backlogs by department, ward and category.',
    status: 'planned',
    evidence: '[PLAN] analytics later',
  },
  {
    name: 'Integrations',
    detail: 'Connections to systems a municipality already uses.',
    status: 'planned',
    evidence: '[PLAN] integrations later',
  },
]

export const statusOrder: CapabilityStatus[] = ['tested', 'implemented', 'planned']

export const statusCopy: Record<CapabilityStatus, { label: string; explanation: string }> = {
  tested: {
    label: 'Tested',
    explanation:
      'Built and covered by the V1 automated test suite, as reported by the development team. Not yet used in a live deployment.',
  },
  implemented: {
    label: 'Implemented',
    explanation: 'Built in the V1 codebase and going through internal testing.',
  },
  planned: {
    label: 'Planned',
    explanation: 'On the roadmap. Not built yet.',
  },
}

export const architecture = {
  current: [
    {
      layer: 'Web application',
      detail: 'React and TypeScript, built with Vite. English, Odia and Hindi through i18next.',
    },
    {
      layer: 'API',
      detail:
        'Django REST Framework with token authentication. Permissions are scoped by role and department.',
    },
    {
      layer: 'Data',
      detail: 'PostgreSQL for complaints, users, departments and the audit log, plus file storage for evidence.',
    },
  ],
  planned: [
    { layer: 'Mobile app', detail: 'React Native client for citizens.' },
    { layer: 'Notifications', detail: 'Email, and SMS where a partner needs it.' },
    { layer: 'AI suggestions', detail: 'Advisory category and priority suggestions, evaluated first.' },
  ],
} as const

export const roadmap = [
  {
    phase: 'Now',
    items: [
      'Finish version 1 and run the full test suite against PostgreSQL.',
      'Security review: access rules, upload validation and private file delivery.',
      'A low-cost pilot deployment with HTTPS and tested backups.',
    ],
  },
  {
    phase: 'Next',
    items: [
      'A pilot of six to eight weeks with one campus or municipal body.',
      'Measure time to assign, time to resolve, and resolutions confirmed by citizens.',
      'Email notifications, and SMS where the pilot partner needs it.',
    ],
  },
  {
    phase: 'Later',
    items: [
      'A React Native app for citizens.',
      'AI suggestions for category and priority, once pilot data shows they help.',
      'Integrations with systems municipalities already use.',
    ],
  },
] as const
