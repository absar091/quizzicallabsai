// Simple error suppression
export function initializeErrorRecovery() {
  if (typeof window === 'undefined') return;
  
  window.onerror = () => true;
  window.onunhandledrejection = () => true;
}

if (typeof window !== 'undefined') {
  initializeErrorRecovery();
}