/**
 * VoyageInfo Component
 *
 * Displays voyage calculation results in collapsible panels
 */

import React from 'react'
import { Gauge, Clock } from 'lucide-react'
import { CollapsiblePanel } from '../../ui/components/CollapsiblePanel'

function MetricCard({ label, value, unit, subtitle, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-800/60 to-blue-700/40 border-blue-600/60 text-blue-200',
    purple: 'from-purple-800/60 to-purple-700/40 border-purple-600/60 text-purple-200',
    red: 'from-red-800/60 to-red-700/40 border-red-600/60 text-red-200',
    yellow: 'from-yellow-800/60 to-yellow-700/40 border-yellow-600/60 text-yellow-200',
    emerald: 'from-emerald-800/60 to-emerald-700/40 border-emerald-600/60 text-emerald-200',
    cyan: 'from-cyan-800/60 to-cyan-700/40 border-cyan-600/60 text-cyan-200',
    indigo: 'from-indigo-800/60 to-indigo-700/40 border-indigo-600/60 text-indigo-200',
    orange: 'from-orange-800/60 to-orange-700/40 border-orange-600/60 text-orange-200',
    pink: 'from-pink-800/60 to-pink-700/40 border-pink-600/60 text-pink-200',
    green: 'from-green-800/60 to-green-700/40 border-green-600/60 text-green-200'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg border`}>
      <div className={`text-xs font-medium mb-1`}>{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className={`text-xs`}>{unit}</div>
      {subtitle && (
        <div className="text-xs text-slate-300 mt-1">{subtitle}</div>
      )}
    </div>
  )
}

export function VoyageInfo({ results }) {
  if (!results) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <CollapsiblePanel
        title="Performance (50% accel / 50% decel)"
        icon={Gauge}
        storageKey="performance-open"
        headerClassName="text-emerald-300"
        defaultOpen={true}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Exhaust Velocity"
            value={results.vExhaustKms.toFixed(0)}
            unit="km/s"
            subtitle={`${(results.vMaxFracC * 100).toFixed(3)}% of c`}
            color="blue"
          />

          <MetricCard
            label="Earth Time (total)"
            value={results.totalDays.toFixed(1)}
            unit="days"
            subtitle={`${(results.totalDays / 30).toFixed(1)} months`}
            color="purple"
          />

          <MetricCard
            label="Max Velocity"
            value={results.vMaxKms.toFixed(0)}
            unit="km/s"
            subtitle={`${(results.vMaxFracC * 100).toFixed(2)}% of c`}
            color="red"
          />

          <MetricCard
            label="Total Distance"
            value={results.distAU.toFixed(0)}
            unit="AU"
            subtitle={`${results.distLightYears.toFixed(6)} ly`}
            color="yellow"
          />

          <MetricCard
            label="Fuel Mass"
            value={(results.fuelKg / 1000).toFixed(0)}
            unit="tons"
            subtitle={`${((results.fuelKg / results.wetMassKg) * 100).toFixed(0)}% of total`}
            color="emerald"
          />

          <MetricCard
            label="Initial Mass Flow"
            value={results.initialMassFlow.toFixed(2)}
            unit="kg/s"
            subtitle={`${(results.initialMassFlow * 3600).toFixed(0)} kg/hr`}
            color="cyan"
          />

          <MetricCard
            label="Accel/Decel Time"
            value={results.accelDays.toFixed(1)}
            unit="days each"
            subtitle="50% of journey"
            color="indigo"
          />

          <MetricCard
            label="Final Mass"
            value={(results.dryMassKg / 1000).toFixed(0)}
            unit="tons"
            subtitle="Structure only"
            color="orange"
          />
        </div>
      </CollapsiblePanel>

      {/* Relativistic Effects */}
      <CollapsiblePanel
        title="Relativistic Effects at Max Velocity"
        icon={Clock}
        storageKey="relativistic-open"
        headerClassName="text-purple-300"
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Lorentz Factor (γ)"
            value={results.gamma.toFixed(8)}
            unit=""
            subtitle="1 = no effects"
            color="purple"
          />

          <MetricCard
            label="Time Dilation"
            value={`${(results.timeDilation * 100).toFixed(4)}%`}
            unit=""
            subtitle="crew time / Earth time"
            color="cyan"
          />

          <MetricCard
            label="Ship Time (proper)"
            value={results.properDays.toFixed(2)}
            unit="days"
            subtitle="what crew experiences"
            color="pink"
          />

          <MetricCard
            label="Time Saved"
            value={(results.totalDays - results.properDays).toFixed(2)}
            unit="days"
            subtitle="vs Earth time"
            color="green"
          />
        </div>

        <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-600/40 text-sm text-slate-200">
          At {(results.vMaxFracC * 100).toFixed(3)}% the speed of light, relativistic effects are{' '}
          {results.gamma > 1.0001 ? 'measurable' : 'negligible'}. The crew ages{' '}
          {((1 - results.timeDilation) * 100).toFixed(4)}% slower than people on Earth during the journey.
        </div>
      </CollapsiblePanel>
    </div>
  )
}
