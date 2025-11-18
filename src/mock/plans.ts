import { SubscriptionPlan } from '../types'

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    tier: 'free',
    pricePerMonth: 0,
    features: ['Up to 1 doctor', 'Basic prescription review demo'],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    tier: 'pro',
    pricePerMonth: 49,
    features: ['Up to 10 doctors', 'AI suggestions', 'Patient portal'],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    pricePerMonth: 199,
    features: ['Unlimited doctors', 'Custom integrations', 'Dedicated support'],
  },
]
