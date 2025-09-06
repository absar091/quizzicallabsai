
'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

type PlaceholderData = {
    searchQuery: string;
    aspectRatio: "1:1" | "4:3" | "16:9";
}

type RichContentRendererProps = {
    content: string;
    smiles?: string | null;
    chartData?: { name: string; value: number }[] | null;
    placeholder?: PlaceholderData | null;
    inline?: boolean;
};

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Enhanced text processing for better AI-generated content rendering
const processTextContent = (text: string) => {
  if (!text) return '';

  // Handle common AI formatting issues
  return text
    // Fix spacing around mathematical operators
    .replace(/([+\-×÷=≠≤≥≈])(?!\s)/g, '$1 ')
    .replace(/(?<!\s)([+\-×÷=≠≤≥≈])/g, ' $1')
    // Fix spacing around parentheses in math
    .replace(/(\w)\(/g, '$1 (')
    .replace(/\)(\w)/g, ') $1')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Fix common AI typos in mathematical expressions
    .replace(/\\times/g, '\\times ')
    .replace(/\\div/g, '\\div ')
    .trim();
};

// This component will find and render LaTeX expressions within a string,
// and also display SMILES chemical structures and charts.
export default function RichContentRenderer({ content, smiles, chartData, placeholder, inline = false }: RichContentRendererProps) {
    if (!content && !smiles && !chartData && !placeholder) return null;

    // Process and clean the content
    const processedContent = processTextContent(content);

    // Regex to find all occurrences of $...$ (inline) and $$...$$ (display)
    const latexRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    // In inline mode, strip all line breaks and <br> tags
    const cleanContent = inline && processedContent ? processedContent.replace(/\n|<br\s*\/?>/gi, ' ') : processedContent;
    const parts = cleanContent ? cleanContent.split(latexRegex) : [];

    const renderLatex = (text: string) => {
        return parts.map((part, index) => {
            if (part.match(latexRegex)) {
                const isDisplay = part.startsWith('$$');
                const latex = part.substring(isDisplay ? 2 : 1, part.length - (isDisplay ? 2 : 1));
                try {
                    return isDisplay ?
                        <BlockMath key={index}>{latex}</BlockMath> :
                        <InlineMath key={index}>{latex}</InlineMath>;
                } catch (e) {
                    console.error("KaTeX parsing error:", e);
                    // Fallback: render the original LaTeX without processing
                    return <span key={index} className="font-mono text-sm bg-muted px-1 rounded">{part}</span>;
                }
            }
            // In inline mode, ensure all spans are inline
            return <span key={index} style={inline ? { display: 'inline' } : {}} className="leading-relaxed">{part}</span>;
        });
    };

    const getAspectRatioClass = (ratio: string) => {
        switch (ratio) {
            case '1:1': return 'aspect-square';
            case '4:3': return 'aspect-[4/3]';
            case '16:9': return 'aspect-video';
            default: return 'aspect-video';
        }
    }

    if (inline) {
        return <span className="text-base leading-relaxed">{renderLatex(processedContent)}</span>;
    }

    return (
        <div className="space-y-4 text-base leading-relaxed">
             {placeholder && (
                 <div className="flex justify-center p-4 bg-muted rounded-lg">
                    <div className={cn("relative w-full max-w-md", getAspectRatioClass(placeholder.aspectRatio))}>
                        <Image
                            src={`https://placehold.co/600x400.png`}
                            alt={`Placeholder for a diagram of ${placeholder.searchQuery}`}
                            fill
                            data-ai-hint={placeholder.searchQuery}
                            className="object-contain rounded-md"
                        />
                    </div>
                </div>
            )}
            {smiles && (
                <div className="flex justify-center p-4 bg-muted rounded-lg">
                    <Image
                        src={`https://www.simplesmiles.io/chem_structure.png?smiles=${encodeURIComponent(smiles)}&bg=transparent&fg=contrast`}
                        alt={`Chemical structure for ${smiles}`}
                        width={300}
                        height={200}
                        unoptimized // External image that we can't optimize
                        className="object-contain dark:invert"
                    />
                </div>
            )}
            {chartData && chartData.length > 0 && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <LineChart
                              data={chartData}
                              width={400}
                              height={200}
                              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="value" stroke="var(--color-value)" />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}
            {processedContent && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    {renderLatex(processedContent)}
                </div>
            )}
        </div>
    );
}
