// Accessibility improvements hook
import { useEffect, useCallback } from 'react';

export function useAccessibility() {
  // Keyboard navigation for quiz questions
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, altKey } = event;
    
    // Skip if user is typing in an input
    if ((event.target as HTMLElement)?.tagName === 'INPUT' || 
        (event.target as HTMLElement)?.tagName === 'TEXTAREA') {
      return;
    }

    switch (key) {
      case '1':
      case '2':
      case '3':
      case '4':
        // Select answer option
        const optionButton = document.querySelector(`[data-option="${key}"]`) as HTMLButtonElement;
        if (optionButton) {
          optionButton.click();
          optionButton.focus();
        }
        break;
        
      case 'ArrowRight':
      case 'n':
      case 'N':
        // Next question
        const nextButton = document.querySelector('[data-action="next"]') as HTMLButtonElement;
        if (nextButton && !nextButton.disabled) {
          nextButton.click();
        }
        break;
        
      case 'ArrowLeft':
      case 'p':
      case 'P':
        // Previous question
        const prevButton = document.querySelector('[data-action="previous"]') as HTMLButtonElement;
        if (prevButton && !prevButton.disabled) {
          prevButton.click();
        }
        break;
        
      case 'Enter':
        // Submit or continue
        const submitButton = document.querySelector('[data-action="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
        break;
        
      case 'Escape':
        // Close modals or go back
        const closeButton = document.querySelector('[data-action="close"]') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
        break;
    }
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  const manageFocus = useCallback((elementSelector: string) => {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // High contrast mode detection
  const detectHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);

  // Reduced motion detection
  const detectReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

  return {
    announceToScreenReader,
    manageFocus,
    detectHighContrast,
    detectReducedMotion
  };
}

// Voice synthesis for questions (accessibility feature)
export function useVoiceQuestions() {
  const speak = useCallback((text: string, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a clear voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, []);

  const isSupported = 'speechSynthesis' in window;

  return { speak, stop, isSupported };
}