import { ApiKey } from '../types'

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    label: 'Primary OpenAI Key',
    provider: 'openai',
    keyMasked: '************A1B2',
    status: 'active',
    successRate: 0.99,
    errorRate: 0.01,
    lastCheckedAt: new Date().toISOString(),
    isPrimary: true,
  },
  {
    id: 'key-2',
    label: 'Backup OpenAI Key',
    provider: 'openai',
    keyMasked: '************C3D4',
    status: 'degraded',
    successRate: 0.92,
    errorRate: 0.08,
    lastCheckedAt: new Date().toISOString(),
    isPrimary: false,
  },
  {
    id: 'key-3',
    label: 'Legacy Azure Key',
    provider: 'azure',
    keyMasked: '************E5F6',
    status: 'down',
    successRate: 0,
    errorRate: 1,
    lastCheckedAt: new Date().toISOString(),
    isPrimary: false,
  },
]
