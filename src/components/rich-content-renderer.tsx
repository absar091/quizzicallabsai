
'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

type PlaceholderData = {
    searchQuery: string;
    aspectRatio: "1:1" | "4:3" | "16:9";
}

type ChartDataPoint = {
    name: string;
    value: number;
    [key: string]: any;
};

type RichContentRendererProps = {
    content: string;
    smiles?: string | null;
    chartData?: ChartDataPoint[] | null;
    chartType?: 'line' | 'bar' | 'area' | 'scatter' | 'pie';
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
    // Improve chemical formula rendering
    .replace(/(\d+)([A-Z])/g, '$1 $2') // Add space between numbers and elements
    .replace(/([A-Z])([A-Z])/g, '$1 $2') // Add space between consecutive elements
    .replace(/(\d+)\s*([A-Z])/g, '$1$2') // Remove space between coefficient and element
    // Fix common LaTeX issues
    .replace(/\\\(/g, '$') // Convert \( to $
    .replace(/\\\)/g, '$') // Convert \) to $
    .replace(/\\\[/g, '$$') // Convert \[ to $$
    .replace(/\\\]/g, '$$') // Convert \] to $$
    .trim();
};

export default function RichContentRenderer({ content, smiles, chartData, chartType = 'line', placeholder, inline = false }: RichContentRendererProps) {
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
                    <div className="text-center mb-2">
                        <span className="text-sm text-muted-foreground">Chemical Structure</span>
                    </div>
                    <Image
                        src={`https://www.simplesmiles.io/chem_structure.png?smiles=${encodeURIComponent(smiles)}&bg=transparent&fg=contrast&size=300x200`}
                        alt={`Chemical structure for SMILES: ${smiles}`}
                        width={300}
                        height={200}
                        unoptimized // External image that we can't optimize
                        className="object-contain dark:invert rounded border"
                        onError={(e) => {
                            // Fallback to text representation if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-text') as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                        }}
                    />
                    <div className="fallback-text hidden text-center mt-2">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{smiles}</span>
                    </div>
                </div>
            )}
            {chartData && chartData.length > 0 && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            {chartType === 'line' && (
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
                            )}
                            {chartType === 'bar' && (
                                <BarChart
                                  data={chartData}
                                  width={400}
                                  height={200}
                                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" fill="var(--color-value)" />
                                </BarChart>
                            )}
                            {chartType === 'area' && (
                                <AreaChart
                                  data={chartData}
                                  width={400}
                                  height={200}
                                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.3} />
                                </AreaChart>
                            )}
                            {chartType === 'scatter' && (
                                <ScatterChart
                                  data={chartData}
                                  width={400}
                                  height={200}
                                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Scatter dataKey="value" fill="var(--color-value)" />
                                </ScatterChart>
                            )}
                            {chartType === 'pie' && (
                                <PieChart width={400} height={200}>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx={200}
                                        cy={100}
                                        outerRadius={80}
                                        fill="var(--color-value)"
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            )}
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
