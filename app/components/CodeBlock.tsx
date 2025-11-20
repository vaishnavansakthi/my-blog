"use client";

import { useEffect, useState } from "react";
import { highlightCode, detectLanguage } from "../utils/highlighter";

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
    const [highlightedHtml, setHighlightedHtml] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const highlight = async () => {
            const lang = language || detectLanguage(code);
            const html = await highlightCode(code, lang);
            setHighlightedHtml(html);
            setIsLoading(false);
        };

        highlight();
    }, [code, language]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="relative my-6">
                <pre className="bg-[#0d1117] text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
                    <code>{code}</code>
                </pre>
            </div>
        );
    }

    return (
        <div className="relative my-6 group">
            {/* Copy button */}
            <button
                className="absolute top-3 right-3 bg-gray-700 text-white text-xs px-3 py-1.5 rounded hover:bg-gray-600 transition-all opacity-0 group-hover:opacity-100"
                onClick={handleCopy}
            >
                {copied ? "✓ Copied!" : "Copy"}
            </button>

            {/* Shiki highlighted code */}
            <div
                className="shiki-wrapper overflow-x-auto rounded-lg"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
        </div>
    );
}
