'use client'

import * as React from 'react'

interface ActivityPoint {
  date: string
  applications: number
  submissions: number
}

interface ActivityChartProps {
  data: ActivityPoint[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.applications, d.submissions)))

  return (
    <div className="flex items-end gap-1.5" aria-label="Activité des 7 derniers jours" style={{ height: '120px' }}>
      {data.map((d, i) => {
        const appHeight = (d.applications / max) * 100
        const subHeight = (d.submissions / max) * 100
        const dayLabel = new Date(d.date).toLocaleDateString('fr', { weekday: 'short' })
        const dayNum = new Date(d.date).getDate()
        const total = d.applications + d.submissions

        return (
          <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute -top-12 z-10 hidden -translate-x-1/2 left-1/2 group-hover:block">
              <div className="whitespace-nowrap rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-premium-lg">
                <p className="font-semibold text-foreground">{total} activité{total > 1 ? 's' : ''}</p>
                <p className="text-muted-foreground">{dayLabel} {dayNum}</p>
                <div className="mt-1 space-y-0.5">
                  <p className="flex items-center gap-1.5 text-accent">
                    <span className="size-2 rounded-sm bg-accent" />
                    {d.applications} candidature{d.applications > 1 ? 's' : ''}
                  </p>
                  <p className="flex items-center gap-1.5 text-primary/70">
                    <span className="size-2 rounded-sm bg-primary/30" />
                    {d.submissions} soumission{d.submissions > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Bars container */}
            <div className="flex h-full w-full items-end justify-center gap-0.5">
              {/* Submissions bar (background, lighter) */}
              <div
                className="w-2.5 rounded-t-sm bg-primary/25 transition-all duration-300 group-hover:bg-primary/40 sm:w-3"
                style={{ height: `${Math.max(subHeight, d.submissions > 0 ? 4 : 0)}%` }}
              />
              {/* Applications bar (foreground, accent) */}
              <div
                className="w-2.5 rounded-t-sm bg-accent transition-all duration-300 group-hover:bg-accent/80 sm:w-3"
                style={{ height: `${Math.max(appHeight, d.applications > 0 ? 4 : 0)}%` }}
              />
            </div>

            {/* Day label */}
            <div className="text-center">
              <p className="text-[0.65rem] font-medium capitalize text-muted-foreground">{dayLabel}</p>
              <p className="text-[0.6rem] text-muted-foreground/70">{dayNum}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
