/**
 * Pull-to-refresh UI placeholder.
 * In production, the Flutter WebView bridge will handle actual refresh logic.
 * This component is a visual-only indicator.
 */
const PullToRefreshPlaceholder = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center justify-center py-4 animate-fade-in-up" aria-live="polite">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="ml-2 text-[12px] font-body text-muted-foreground">Refreshing...</span>
    </div>
  );
};

export default PullToRefreshPlaceholder;
