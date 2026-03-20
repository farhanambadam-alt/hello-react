import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Routes that are bottom-nav tabs — these reset the stack instead of pushing. */
const TAB_ROUTES = ['/', '/at-home', '/explore', '/bookings', '/profile'];

const getFallbackParentRoute = (path: string): string => {
  if (path.startsWith('/artist/') || path.startsWith('/at-home-booking/')) {
    return '/at-home';
  }
  if (path.startsWith('/salon/') || path.startsWith('/booking/')) {
    return '/';
  }
  return '/';
};

const createInitialRouteStack = (path: string): string[] => {
  if (TAB_ROUTES.includes(path)) {
    return [path];
  }
  const parent = getFallbackParentRoute(path);
  return parent === path ? [path] : [parent, path];
};

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: unknown[]) => void;
    };
    navigateTo?: (path: string) => void;
    appBack?: () => void;
    isRootRoute?: () => boolean;
  }
}

/** Module-level route stack — persists across re-renders, single source of truth. */
const routeStack: string[] = createInitialRouteStack(window.location.pathname || '/');

/**
 * Remove routes matching a prefix from the stack (e.g. after completing a flow).
 */
export function cleanRouteStack(prefix: string) {
  for (let i = routeStack.length - 1; i >= 0; i--) {
    if (routeStack[i].startsWith(prefix)) {
      routeStack.splice(i, 1);
    }
  }
  if (routeStack.length === 0) {
    routeStack.push('/');
  }
}

/**
 * Bi-directional navigation bridge between React Router and Flutter WebView.
 *
 * IMPORTANT: All hooks are declared unconditionally at the top level
 * in a fixed order to satisfy the Rules of Hooks.
 */
export function useFlutterBridge() {
  // ── Hook declarations (fixed order, never conditional) ──
  const location = useLocation();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const isHandlingPopStateRef = useRef(false);

  // Keep ref current without adding a hook
  navigateRef.current = navigate;

  // ── Effect 1: Seed stack on mount ──
  useEffect(() => {
    if (routeStack.length === 0) {
      const initial = createInitialRouteStack(window.location.pathname || '/');
      routeStack.push(...initial);
    }
  }, []);

  // ── Effect 2: Sync route stack on every route change ──
  useEffect(() => {
    const path = location.pathname;
    const isTab = TAB_ROUTES.includes(path);

    if (isTab) {
      routeStack.length = 0;
      routeStack.push(path);
    } else if (routeStack[routeStack.length - 1] !== path) {
      routeStack.push(path);
    }

    try {
      window.flutter_inappwebview?.callHandler('routeChanged', path);
    } catch {
      /* bridge not ready */
    }
  }, [location.pathname]);

  // ── Effect 3: Expose globals + popstate listener ──
  useEffect(() => {
    window.navigateTo = (path: string) => {
      if (!path) return;
      try {
        if (window.location.pathname === path) return;
        const isTab = TAB_ROUTES.includes(path);

        if (isTab) {
          routeStack.length = 0;
          routeStack.push(path);
        } else if (routeStack[routeStack.length - 1] !== path) {
          routeStack.push(path);
        }

        navigateRef.current(path, { replace: isTab });
      } catch (e) {
        console.error('Navigation error:', e);
      }
    };

    window.appBack = () => {
      if (routeStack.length <= 1) {
        try {
          window.flutter_inappwebview?.callHandler('exitApp');
        } catch {
          /* bridge not ready */
        }
        return;
      }

      const current = routeStack.pop();
      const previous = routeStack[routeStack.length - 1];

      if (!previous || previous === current) {
        routeStack.length = 0;
        routeStack.push(current || '/');
        try {
          window.flutter_inappwebview?.callHandler('exitApp');
        } catch {
          /* bridge not ready */
        }
        return;
      }

      navigateRef.current(previous, { replace: true });
      try {
        window.flutter_inappwebview?.callHandler('routeChanged', previous);
      } catch {
        /* bridge not ready */
      }
    };

    window.isRootRoute = () => routeStack.length <= 1;

    const handlePopState = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      isHandlingPopStateRef.current = true;

      const top = routeStack[routeStack.length - 1];
      if (top && window.location.pathname !== top) {
        window.history.replaceState(null, '', top);
      }

      window.appBack?.();

      queueMicrotask(() => {
        isHandlingPopStateRef.current = false;
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      delete window.navigateTo;
      delete window.appBack;
      delete window.isRootRoute;
    };
  }, []);
}
