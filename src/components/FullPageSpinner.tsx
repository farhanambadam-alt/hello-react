/**
 * Reusable full-page centered loading spinner.
 * Uses viewport-relative height to guarantee centering
 * inside the scroll container or any parent.
 */
const FullPageSpinner = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex items-center justify-center w-full" style={{ minHeight: 'calc(100dvh - 120px)' }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-[3px] border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground font-body">{label}</span>
    </div>
  </div>
);

export default FullPageSpinner;
