/**
 * Site configuration and pricing constants (single source of truth).
 */

export const PRICE_USD = 99
export const REFUND_MODE: 'none' | '7day' = '7day' // I will set this to match my refund policy
export const SHOW_FREE_PLAN = false // set true only if the free account has real value
export const FREE_FEATURES: string[] = [] // used only when SHOW_FREE_PLAN is true
export const LIFETIME_FEATURES: string[] = [
  'Access to all courses on the platform',
  'Lifetime updates included',
  'Request new courses',
  'One-time payment, never pay again',
] // I will edit this list; do not add other claims
