function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const rand = seededRandom(42)

const WEEKS = 53
const DAYS = WEEKS * 7
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildContributions() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDow = today.getDay()
  const gridEnd = new Date(today)
  gridEnd.setDate(gridEnd.getDate() + (6 - endDow))
  const start = new Date(gridEnd)
  start.setDate(start.getDate() - (DAYS - 1))

  const days = []
  for (let i = 0; i < DAYS; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const dow = date.getDay()
    const weekIndex = Math.floor(i / 7)

    
    const wave = (Math.sin(weekIndex * 0.35) + 1) / 2
    const weekendFactor = dow === 0 || dow === 6 ? 0.55 : 1

    let count = -1 
    if (date <= today) {
      const activityChance = (0.3 + wave * 0.4) * weekendFactor
      const roll = rand()
      if (roll < activityChance) {
        const intensity = rand()
        count = intensity < 0.55 ? 1
          : intensity < 0.85 ? Math.floor(2 + rand() * 3)
          : Math.floor(5 + rand() * 7)
      } else {
        count = 0
      }
    }
    days.push({ date, count, dow, weekIndex })
  }
  return days
}

function levelColor(count) {
  if (count <= 0) return '#141b17'
  if (count < 3) return '#123a22'
  if (count < 6) return '#1f7a3f'
  if (count < 10) return '#2fbf63'
  return '#39ff88'
}

const days = buildContributions()
const totalContributions = days.filter((d) => d.count > 0).reduce((sum, d) => sum + d.count, 0)

const monthLabels = []
let lastMonth = -1
for (let w = 0; w < WEEKS; w++) {
  const firstDayOfWeek = days[w * 7]
  const m = firstDayOfWeek.date.getMonth()
  if (m !== lastMonth) {
    monthLabels.push({ week: w, label: MONTH_NAMES[m] })
    lastMonth = m
  }
}

export default function GithubActivity() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span className="w-1 h-4 bg-accent inline-block" /> GITHUB ACTIVITY
        </h2>
        <span className="text-xs text-gray-500">{totalContributions} contributions in the last year</span>
      </div>

      <div className="rounded-lg border border-line bg-panel p-5 overflow-x-auto">
        <div className="inline-block">
          {/* month labels */}
          <div className="flex ml-8 mb-1 text-[10px] text-gray-500" style={{ height: 12 }}>
            {Array.from({ length: WEEKS }).map((_, w) => {
              const m = monthLabels.find((ml) => ml.week === w)
              return (
                <span key={w} style={{ width: 14 }}>
                  {m ? m.label : ''}
                </span>
              )
            })}
          </div>

          <div className="flex">
            {/* weekday labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-500 mr-2" style={{ height: 98 }}>
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>

            {/* grid */}
            <div className="grid gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column' }}>
              {days.map((d, i) => (
                <span
                  key={i}
                  title={
                    d.count < 0
                      ? undefined
                      : `${d.date.toDateString()}: ${d.count} contribution${d.count === 1 ? '' : 's'}`
                  }
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{
                    background: d.count < 0 ? 'transparent' : levelColor(d.count),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-500">
          <span>Less</span>
          {['#141b17', '#123a22', '#1f7a3f', '#2fbf63', '#39ff88'].map((c) => (
            <span key={c} className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  )
}
