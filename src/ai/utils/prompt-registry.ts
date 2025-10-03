// Utility to prevent duplicate Genkit prompt registrations during development

const registeredPrompts = new Set<string>();

export function getUniquePromptName(baseName: string): string {
  // In production, use the base name as-is
  if (process.env.NODE_ENV === 'production') {
    return baseName;
  }
  
  // In development, check if already registered
  if (registeredPrompts.has(baseName)) {
    // Create a unique name with timestamp and random suffix
    const uniqueName = `${baseName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    registeredPrompts.add(uniqueName);
    return uniqueName;
  }
  
  // First time registration
  registeredPrompts.add(baseName);
  return baseName;
}

export function clearPromptRegistry(): void {
  registeredPrompts.clear();
}

// Auto-clear registry on module reload in development
if (process.env.NODE_ENV !== 'production') {
  // Clear registry when module is reloaded
  if (typeof global !== 'undefined') {
    (global as any).__GENKIT_PROMPT_REGISTRY_CLEARED = true;
  }
}