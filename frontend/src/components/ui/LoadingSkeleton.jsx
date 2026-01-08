export function CardSkeleton() {
  return (
    <div className="p-6 glass-card rounded-2xl animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-white/10 rounded w-24"></div>
          <div className="h-4 bg-white/5 rounded w-32"></div>
        </div>
        <div className="h-6 w-6 bg-white/10 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-white/10 rounded w-32"></div>
        <div className="h-5 bg-white/5 rounded w-24"></div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-12 bg-white/10 rounded-lg"></div>
          ))}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-16 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="h-96 bg-white/5 rounded-xl flex items-end justify-around p-4">
        {[40, 60, 45, 70, 55, 80, 65, 75, 50, 90].map((height, i) => (
          <div
            key={i}
            className="bg-white/10 rounded-t"
            style={{ height: `${height}%`, width: '8%' }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 glass-card rounded-2xl animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-white/10 rounded w-24"></div>
                <div className="h-4 bg-white/5 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded w-20"></div>
              <div className="h-4 bg-white/5 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded"
          style={{ width: `${100 - i * 10}%` }}
        ></div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-10 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="h-12 bg-white/10 rounded-xl w-full animate-pulse"></div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-6 bg-white/10 rounded w-32 mb-4 animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 glass-card rounded-2xl animate-pulse">
                <div className="h-5 bg-white/10 rounded w-20 mb-2"></div>
                <div className="h-8 bg-white/10 rounded w-24 mb-1"></div>
                <div className="h-4 bg-white/5 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 bg-white/10 rounded w-28 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 glass-card rounded-2xl h-20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="h-6 bg-white/10 rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

