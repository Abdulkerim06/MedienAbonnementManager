const POST_AUTH_REDIRECT_KEY = 'post_auth_redirect';
const AUTH_CALLBACK_PATH = '/auth-callback';

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildKeycloakRedirectUri(): string {
  if (typeof window === 'undefined') {
    return AUTH_CALLBACK_PATH;
  }

  return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
}

export function rememberPostAuthRedirect(path: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, normalizePath(path));
}

export function consumePostAuthRedirect(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const path = sessionStorage.getItem(POST_AUTH_REDIRECT_KEY);
  if (!path) {
    return null;
  }

  sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY);
  return path;
}

export function isAuthCallbackPath(): boolean {
  return typeof window !== 'undefined' && window.location.pathname === AUTH_CALLBACK_PATH;
}
