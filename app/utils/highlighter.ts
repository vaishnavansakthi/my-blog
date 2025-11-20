import { codeToHtml } from 'shiki';

/**
 * Highlights code using Shiki with VS Code themes
 * @param code - The code string to highlight
 * @param language - Programming language (e.g., 'javascript', 'python', 'typescript')
 * @returns HTML string with syntax highlighting
 */
export async function highlightCode(
    code: string,
    language: string = 'javascript'
): Promise<string> {
    try {
        const html = await codeToHtml(code, {
            lang: language,
            theme: 'github-dark',
        });
        return html;
    } catch (error) {
        console.error('Syntax highlighting failed:', error);
        // Fallback to plain code block if highlighting fails
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
}

/**
 * Detects programming language from code content
 * Basic heuristics for common languages
 */
export function detectLanguage(code: string): string {
    const trimmed = code.trim();

    // Check for common patterns
    if (trimmed.includes('import React') || trimmed.includes('useState')) return 'tsx';
    if (trimmed.includes('function') && trimmed.includes('=>')) return 'javascript';
    if (trimmed.includes('def ') || trimmed.includes('import ')) return 'python';
    if (trimmed.includes('const') || trimmed.includes('let')) return 'typescript';
    if (trimmed.includes('<?php')) return 'php';
    if (trimmed.includes('public class')) return 'java';
    if (trimmed.includes('#include')) return 'cpp';
    if (trimmed.includes('SELECT') || trimmed.includes('FROM')) return 'sql';

    return 'javascript'; // default fallback
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
