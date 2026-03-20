const SalonDetailSkeleton = () => (
  <div className="min-h-screen pb-24 md:max-w-5xl md:mx-auto animate-pulse">
    {/* Hero */}
    <div className="h-[280px] bg-muted rounded-b-[28px] md:rounded-2xl md:mt-6 md:mx-5" />

    {/* Info */}
    <div className="px-5 pt-5 space-y-3">
      <div className="h-6 w-2/3 bg-muted rounded-full" />
      <div className="h-4 w-1/2 bg-muted rounded-full" />
      <div className="h-4 w-1/3 bg-muted rounded-full" />
      <div className="flex gap-2 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-16 bg-muted rounded-lg" />
        ))}
      </div>
    </div>

    {/* Tabs */}
    <div className="flex gap-2 px-5 pt-5 pb-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 w-20 bg-muted rounded-xl" />
      ))}
    </div>

    {/* Service cards */}
    <div className="px-5 space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border">
          <div className="w-16 h-16 bg-muted rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-muted rounded-full" />
            <div className="h-3 w-1/4 bg-muted rounded-full" />
            <div className="h-4 w-1/3 bg-muted rounded-full" />
          </div>
          <div className="h-10 w-16 bg-muted rounded-xl flex-shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export default SalonDetailSkeleton;
