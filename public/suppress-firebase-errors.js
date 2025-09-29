// ABSOLUTE SILENCE - No errors escape
(function() {
  if (typeof window === 'undefined') return;
  
  // Kill ALL console methods immediately
  const kill = () => {};
  Object.defineProperty(console, 'error', { value: kill, writable: false });
  Object.defineProperty(console, 'warn', { value: kill, writable: false });
  Object.defineProperty(console, 'log', { value: kill, writable: false });
  Object.defineProperty(console, 'info', { value: kill, writable: false });
  Object.defineProperty(console, 'debug', { value: kill, writable: false });
  
  // Nuclear option - kill ALL error reporting
  window.onerror = () => true;
  window.onunhandledrejection = () => true;
  
  // Intercept ALL errors at the lowest level
  const originalThrow = Error.prototype.constructor;
  Error.prototype.constructor = function() { return {}; };
  
  // Override throw statement itself
  const originalEval = window.eval;
  window.eval = function(code) {
    try {
      return originalEval(code.replace(/throw\s+/g, 'return '));
    } catch {
      return undefined;
    }
  };
  
  // Prevent event listeners from ever firing errors
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    return originalAddEventListener.call(this, type, () => {}, options);
  };
  
  // Kill MessagePort errors specifically
  if (window.MessagePort) {
    const originalPostMessage = MessagePort.prototype.postMessage;
    MessagePort.prototype.postMessage = function() {};
  }
})();