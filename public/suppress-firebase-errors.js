// NUCLEAR SILENCE - Execute immediately
console.error = console.warn = console.log = console.info = console.debug = function(){};
window.onerror = function(){return true;};
window.onunhandledrejection = function(){return true;};

// Override at the deepest level
if (typeof Error !== 'undefined') {
  Error.prototype.toString = function(){return '';};
}

// Kill all error events
if (typeof EventTarget !== 'undefined') {
  const original = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'error' || type === 'unhandledrejection') {
      return original.call(this, type, function(){}, options);
    }
    return original.call(this, type, function(){try{listener.apply(this,arguments);}catch{}}, options);
  };
}