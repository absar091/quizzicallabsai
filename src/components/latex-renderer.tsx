
'use client';

import 'katex/dist/katex.min.css';
import Latex from 'react-katex';

type LatexRendererProps = {
    text: string;
};

// This component will find and render LaTeX expressions within a string.
export default function LatexRenderer({ text }: LatexRendererProps) {
    if (!text) return null;

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
