'use client';

import 'katex/dist/katex.min.css';
import Latex from 'react-katex';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

type PlaceholderData = {
    searchQuery: string;
    aspectRatio: "1:1" | "4:3" | "16:9";
}

type RichContentRendererProps = {
    content: string;
    smiles?: string | null;
    chartData?: { name: string; value: number }[] | null;
    placeholder?: PlaceholderData | null;
};

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// This component will find and render LaTeX expressions within a string,
// and also display SMILES chemical structures and charts.
export default function RichContentRenderer({ content, smiles, chartData, placeholder }: RichContentRendererProps) {
    if (!content && !smiles && !chartData && !placeholder) return null;

    // Regex to find all occurrences of $...$ (inline) and $$...$$ (display)
    const latexRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const parts = content ? content.split(latexRegex) : [];

    const renderLatex = (text: string) => {
        return parts.map((part, index) => {
            if (part.match(latexRegex)) {
                const isDisplay = part.startsWith('$$');
                const latex = part.substring(isDisplay ? 2 : 1, part.length - (isDisplay ? 2 : 1));
                try {
                    return <Latex key={index} block={isDisplay}>{latex}</Latex>;
                } catch (e) {
                    console.error("KaTeX parsing error:", e);
                    return <span key={index}>{part}</span>;
                }
            }
            return <span key={index}>{part}</span>;
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

    return (
        <div className="space-y-4">
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
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            {content && <span>{renderLatex(content)}</span>}
        </div>
    );
}