'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface LaTeXRendererProps {
  content: string;
  displayMode?: boolean;
  className?: string;
}

export function LaTeXRenderer({ content, displayMode = false, className = '' }: LaTeXRendererProps) {
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      try {
        // Render LaTeX using KaTeX
        katex.render(content, containerRef.current, {
          displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
          trust: true,
          macros: {
            "\\ce": "\\mathrm{#1}", // Chemistry equations
            "\\pu": "\\mathrm{#1}", // Physical units
          }
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = content;
        }
      }
    }
  }, [content, displayMode]);

  return <span ref={containerRef} className={className} />;
}

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  // Parse content and render LaTeX inline
  const renderContent = () => {
    // Match LaTeX expressions: $...$ for inline, $$...$$ for display
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Display mode LaTeX
        const latex = part.slice(2, -2);
        return <LaTeXRenderer key={index} content={latex} displayMode={true} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline LaTeX
        const latex = part.slice(1, -1);
        return <LaTeXRenderer key={index} content={latex} displayMode={false} />;
      } else {
        // Regular text
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  return <div className={className}>{renderContent()}</div>;
}

// Chemistry equation renderer
export function ChemistryEquation({ equation, className = '' }: { equation: string; className?: string }) {
  return <LaTeXRenderer content={`\\ce{${equation}}`} className={className} />;
}

// Physics formula renderer
export function PhysicsFormula({ formula, className = '' }: { formula: string; className?: string }) {
  return <LaTeXRenderer content={formula} displayMode={true} className={className} />;
}

// Math expression renderer
export function MathExpression({ expression, inline = true, className = '' }: { expression: string; inline?: boolean; className?: string }) {
  return <LaTeXRenderer content={expression} displayMode={!inline} className={className} />;
}
