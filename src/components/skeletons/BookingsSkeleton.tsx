const BookingsSkeleton = () => (
  <div className="min-h-screen pb-24 md:max-w-5xl md:mx-auto animate-pulse">
    {/* Header */}
    <div className="px-5 pt-6 pb-2">
      <div className="h-6 w-32 bg-muted rounded-full" />
      <div className="h-3 w-44 bg-muted rounded-full mt-2" />
    </div>

    {/* Tabs */}
    <div className="flex gap-2 px-5 py-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-9 w-24 bg-muted rounded-full" />
      ))}
    </div>

    {/* Cards */}
    <div className="px-5 space-y-4 mt-1">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
          <div className="h-28 bg-muted" />
          <div className="p-3.5 space-y-3">
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-muted rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 bg-muted rounded-full" />
                <div className="h-4 w-3/4 bg-muted rounded-full" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-muted rounded-lg" />
              <div className="flex-1 h-10 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BookingsSkeleton;
