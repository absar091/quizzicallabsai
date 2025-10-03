// Suppress Genkit registry warnings during development
// These warnings are harmless and occur due to hot reloading in development

if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Suppress specific Genkit registry warnings
    if (
      message.includes('already has an entry in the registry') ||
      message.includes('WARNING: /prompt/') ||
      message.includes('WARNING: /executable-prompt/')
    ) {
      return; // Suppress these warnings
    }
    
    // Allow all other warnings through
    originalWarn.apply(console, args);
  };
}

export {}; // Make this a module