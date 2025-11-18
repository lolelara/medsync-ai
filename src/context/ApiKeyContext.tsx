import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { ApiKey } from '../types'
import { mockApiKeys } from '../mock/apiKeys'
import { getActiveKey, getPrimaryKey, maskKey, simulateHealthCheck } from '../services/apiKeyManager'

interface ApiKeyContextValue {
  apiKeys: ApiKey[]
  primaryKey: ApiKey | null
  activeKey: ApiKey | null
  autoRotationEnabled: boolean
  setAutoRotationEnabled: (value: boolean) => void
  addApiKey: (label: string, provider: ApiKey['provider'], rawKey: string) => void
  deleteApiKey: (id: string) => void
  setPrimaryKey: (id: string) => void
  runHealthCheck: () => void
}

const ApiKeyContext = createContext<ApiKeyContextValue | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(true)

  const primaryKey = useMemo(() => getPrimaryKey(apiKeys), [apiKeys])
  const activeKey = useMemo(() => getActiveKey(apiKeys), [apiKeys])

  const addApiKey = (label: string, provider: ApiKey['provider'], rawKey: string) => {
    const masked = maskKey(rawKey)
    const now = new Date().toISOString()
    const key: ApiKey = {
      id: `key-${Date.now()}`,
      label,
      provider,
      keyMasked: masked,
      status: 'untested',
      successRate: 0,
      errorRate: 0,
      lastCheckedAt: now,
      isPrimary: apiKeys.length === 0,
    }
    setApiKeys(prev => [...prev, key])
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id))
  }

  const setPrimaryKey = (id: string) => {
    setApiKeys(prev =>
      prev.map(k => ({
        ...k,
        isPrimary: k.id === id,
      }))
    )
  }

  const runHealthCheck = () => {
    setApiKeys(prev => simulateHealthCheck(prev))
  }

  const value: ApiKeyContextValue = {
    apiKeys,
    primaryKey,
    activeKey,
    autoRotationEnabled,
    setAutoRotationEnabled,
    addApiKey,
    deleteApiKey,
    setPrimaryKey,
    runHealthCheck,
  }

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
}

export function useApiKeys() {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider')
  }
  return ctx
}
