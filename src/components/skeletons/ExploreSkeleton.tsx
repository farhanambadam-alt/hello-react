const ExploreSkeleton = () => (
  <div className="min-h-screen pb-20 md:max-w-5xl md:mx-auto animate-pulse">
    {/* Header */}
    <div className="px-5 pt-5 pb-3">
      <div className="h-5 w-20 bg-muted rounded-full mb-3" />
      <div className="h-14 bg-muted rounded-2xl" />
    </div>

    {/* Category chips */}
    <div className="flex gap-5 px-5 py-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-[62px] h-[62px] bg-muted rounded-full" />
          <div className="h-3 w-10 bg-muted rounded-full" />
        </div>
      ))}
    </div>

    {/* Salon cards */}
    <div className="px-5 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
          <div className="h-[180px] bg-muted" />
          <div className="p-4 space-y-2.5">
            <div className="h-4 w-2/3 bg-muted rounded-full" />
            <div className="h-3 w-1/2 bg-muted rounded-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-1/4 bg-muted rounded-full" />
              <div className="h-10 w-24 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ExploreSkeleton;
