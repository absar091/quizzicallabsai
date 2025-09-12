
'use client';

import { useEffect } from 'react';
import Latex from 'react-katex';

type LatexRendererProps = {
    text: string;
};

// This component will find and render LaTeX expressions within a string.
export default function LatexRenderer({ text }: LatexRendererProps) {
    if (!text) return null;

    // Dynamic loading of KaTeX CSS only when needed
    useEffect(() => {
        if (text && text.includes('$')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            link.onload = () => {
                // CSS loaded successfully
            };
            link.onerror = () => {
                console.warn('Failed to load KaTeX CSS');
            };
            document.head.appendChild(link);

            // Cleanup function
            return () => {
                try {
                    document.head.removeChild(link);
                } catch (e) {
                    // Link might already be removed
                }
            };
        }
    }, [text]);

    // Regex to find all occurrences of $...$ (inline) and $$...$$ (display)
    const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) => {
                if (part.match(regex)) {
                    const isDisplay = part.startsWith('$$');
                    const latex = part.substring(isDisplay ? 2 : 1, part.length - (isDisplay ? 2 : 1));
                    try {
                         return <Latex key={index} block={isDisplay}>{latex}</Latex>;
                    } catch (e) {
                        // If KaTeX fails to parse, just return the original string part
                        console.error("KaTeX parsing error:", e);
                        return <span key={index}>{part}</span>;
                    }
                }
                // Return plain text parts
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
}
