import { FormEvent, useState } from 'react'
import { useApiKeys } from '../../context/ApiKeyContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusPill } from '../../components/ui/StatusPill'
import { Table } from '../../components/ui/Table'

function AdminApiKeysPage() {
  const { apiKeys, primaryKey, activeKey, addApiKey, deleteApiKey, setPrimaryKey, runHealthCheck, autoRotationEnabled, setAutoRotationEnabled } =
    useApiKeys()

  const [label, setLabel] = useState('')
  const [provider, setProvider] = useState<'openai' | 'azure' | 'other'>('openai')
  const [rawKey, setRawKey] = useState('')

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    if (!label || !rawKey) return
    addApiKey(label, provider, rawKey)
    setLabel('')
    setRawKey('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">API key management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure multiple ChatGPT/OpenAI/other keys with automatic failover and lightweight health checks.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end text-xs">
          <span className="text-slate-500">Currently active key</span>
          <span className="font-medium text-teal-700">{activeKey ? activeKey.label : 'No active key'}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Configured keys</h2>
              <p className="text-xs text-slate-500">
                Demo data only. Keys are masked and never sent to any external service.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={runHealthCheck}>
              Run health check
            </Button>
          </div>

          <Table>
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Label
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Provider
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Masked key
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Metrics
                </th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {apiKeys.map(key => (
                <tr key={key.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{key.label}</span>
                      {key.isPrimary && (
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                          Primary
                        </span>
                      )}
                      {activeKey?.id === key.id && (
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 uppercase tracking-wide">{key.provider}</td>
                  <td className="px-3 py-2 text-xs text-slate-600 font-mono">{key.keyMasked}</td>
                  <td className="px-3 py-2 text-xs">
                    <StatusPill type="apikey" status={key.status} />
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-600">
                    {Math.round(key.successRate * 100)}% success · {Math.round(key.errorRate * 100)}% error
                    <br />
                    {key.lastCheckedAt && (
                      <span className="text-slate-400">
                        Checked {new Date(key.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-right space-x-1">
                    {!key.isPrimary && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPrimaryKey(key.id)}
                        className="mb-1"
                      >
                        Set primary
                      </Button>
                    )}
                    {primaryKey?.id !== key.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApiKey(key.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-900">Add API key</h2>
            <p className="mt-1 text-xs text-slate-500">
              Simulate onboarding an additional AI engine key. Values are stored only in the local demo state.
            </p>
            <form onSubmit={handleAdd} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-700">Label</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Primary OpenAI Key"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Provider</label>
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={provider}
                  onChange={e => setProvider(e.target.value as any)}
                >
                  <option value="openai">OpenAI</option>
                  <option value="azure">Azure OpenAI</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Key (mock)</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs font-mono shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={rawKey}
                  onChange={e => setRawKey(e.target.value)}
                  placeholder="sk-live-xxxxxxxxxxxx"
                />
              </div>
              <Button type="submit" size="sm" className="w-full mt-2">
                Add key
              </Button>
            </form>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-900">Failover policy (demo)</h2>
            <p className="mt-1 text-xs text-slate-500">
              When auto-rotation is enabled, the platform will select the next healthy key if the primary
              becomes degraded or down during health checks.
            </p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-slate-900">Auto-rotation mode</div>
                <div className="text-slate-500">Use backup keys automatically if the primary fails.</div>
              </div>
              <label className="inline-flex items-center gap-2">
                <span className="text-slate-500">Off</span>
                <button
                  type="button"
                  onClick={() => setAutoRotationEnabled(!autoRotationEnabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoRotationEnabled ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      autoRotationEnabled ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-slate-900">On</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminApiKeysPage
