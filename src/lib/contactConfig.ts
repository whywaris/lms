/**
 * Shared contact configuration used by the contact page and the /api/contact route.
 */

export const BUSINESS_NAME = 'PandaCourses'
export const SUPPORT_EMAIL = 'support@pandacourses.com'
export const DMCA_EMAIL = 'support@pandacourses.com'
export const WHATSAPP_URL = '' // if empty, reuse the exact WhatsApp URL already used on the course pages
export const PHONE_DISPLAY = '' // e.g. "+44 7729 314114"; if empty hide the phone/WhatsApp number line
export const RESPONSE_TIME = 'within 24 hours' // I will edit this to be accurate; if empty, never state a response time
export const SUPPORT_HOURS = '' // e.g. "Mon-Sat, 10am-8pm"; if empty, hide it
export const ADDRESS_LINES: string[] = [] // if empty, hide the office card completely

export const DEFAULT_WHATSAPP_URL =
  'https://wa.me/447729314114?text=Hello!%20I%20have%20a%20Question.'

export const CONTACT_SUBJECTS = [
  'Access / login problem',
  'Payment or billing',
  'Request a course',
  'Refund question',
  'Copyright / DMCA notice',
  'Other',
] as const

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number]
