import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We couldn\'t load this page. Please try again.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center text-center px-8 py-20 min-h-[60vh]">
    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
      <AlertTriangle size={32} className="text-destructive" />
    </div>
    <h2 className="font-heading font-bold text-lg text-foreground">{title}</h2>
    <p className="text-sm font-body text-muted-foreground mt-2 max-w-[280px] leading-relaxed">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 btn-themed font-heading font-semibold text-[14px] px-8 py-3 rounded-2xl min-h-[48px]"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
