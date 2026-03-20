import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PageFloatingFooterProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const PageFloatingFooter = ({
  children,
  className = '',
  style,
}: PageFloatingFooterProps) => {
  if (typeof document === 'undefined') return null;

  const host = document.getElementById('page-floating-footer-root');
  if (!host) return null;

  return createPortal(
    <div
      className={`pointer-events-auto absolute inset-x-0 bottom-0 ${className}`.trim()}
      style={style}
    >
      {children}
    </div>,
    host,
  );
};

export default PageFloatingFooter;
