import { ApiKey, ApiKeyStatus } from '../types'

export function getPrimaryKey(apiKeys: ApiKey[]): ApiKey | null {
  return apiKeys.find(k => k.isPrimary) ?? null
}

export function getActiveKey(apiKeys: ApiKey[]): ApiKey | null {
  const primary = getPrimaryKey(apiKeys)
  if (primary && (primary.status === 'active' || primary.status === 'degraded')) {
    return primary
  }
  return (
    apiKeys.find(k => k.status === 'active' || k.status === 'degraded') ?? null
  )
}

export function maskKey(rawKey: string): string {
  const trimmed = rawKey.trim()
  if (!trimmed) return '********'
  const visible = trimmed.slice(-4)
  return '************' + visible
}

export function simulateHealthCheck(apiKeys: ApiKey[]): ApiKey[] {
  const now = new Date().toISOString()
  return apiKeys.map(key => {
    const r = Math.random()
    let status: ApiKeyStatus = 'active'
    let successRate = 0.98
    let errorRate = 0.02

    if (r > 0.9) {
      status = 'down'
      successRate = 0
      errorRate = 1
    } else if (r > 0.75) {
      status = 'degraded'
      successRate = 0.9
      errorRate = 0.1
    }

    return {
      ...key,
      status,
      successRate,
      errorRate,
      lastCheckedAt: now,
    }
  })
}
