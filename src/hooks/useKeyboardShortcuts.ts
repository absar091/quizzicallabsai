'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
      const altMatch = !!shortcut.altKey === event.altKey;
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
      const metaMatch = !!shortcut.metaKey === event.metaKey;

      return keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
}

// Common shortcuts for quiz interface
export function useQuizKeyboardShortcuts({
  onNext,
  onPrevious,
  onSubmit,
  onSelectOption,
  onBookmark,
  onHelp,
  enabled = true
}: {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  onSelectOption?: (index: number) => void;
  onBookmark?: () => void;
  onHelp?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      key: 'ArrowRight',
      action: () => onNext?.(),
      description: 'Next question',
      category: 'Navigation'
    },
    {
      key: 'ArrowLeft',
      action: () => onPrevious?.(),
      description: 'Previous question',
      category: 'Navigation'
    },
    {
      key: 'Enter',
      action: () => onSubmit?.(),
      description: 'Submit answer',
      category: 'Actions'
    },
    
    // Option selection (1-4 keys)
    ...(onSelectOption ? [
      {
        key: '1',
        action: () => onSelectOption(0),
        description: 'Select option A',
        category: 'Selection'
      },
      {
        key: '2',
        action: () => onSelectOption(1),
        description: 'Select option B',
        category: 'Selection'
      },
      {
        key: '3',
        action: () => onSelectOption(2),
        description: 'Select option C',
        category: 'Selection'
      },
      {
        key: '4',
        action: () => onSelectOption(3),
        description: 'Select option D',
        category: 'Selection'
      }
    ] : []),
    
    // Utility shortcuts
    {
      key: 'b',
      ctrlKey: true,
      action: () => onBookmark?.(),
      description: 'Bookmark quiz',
      category: 'Utility'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => onHelp?.(),
      description: 'Show help',
      category: 'Utility'
    },
    {
      key: 'h',
      action: () => onHelp?.(),
      description: 'Show help',
      category: 'Utility'
    }
  ].filter(Boolean) as KeyboardShortcut[];

  useKeyboardShortcuts(shortcuts, enabled);

  return shortcuts;
}

// Global app shortcuts
export function useGlobalKeyboardShortcuts({
  onSearch,
  onProfile,
  onDashboard,
  onNewQuiz,
  enabled = true
}: {
  onSearch?: () => void;
  onProfile?: () => void;
  onDashboard?: () => void;
  onNewQuiz?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => onSearch?.(),
      description: 'Open search',
      category: 'Global'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => onProfile?.(),
      description: 'Go to profile',
      category: 'Global'
    },
    {
      key: 'd',
      ctrlKey: true,
      action: () => onDashboard?.(),
      description: 'Go to dashboard',
      category: 'Global'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => onNewQuiz?.(),
      description: 'Create new quiz',
      category: 'Global'
    }
  ];

  useKeyboardShortcuts(shortcuts, enabled);

  return shortcuts;
}