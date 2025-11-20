/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { BLOCKS, INLINES, MARKS, Document } from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import CodeBlock from "./components/CodeBlock";

// Extract text from a paragraph that contains multiple code lines
function extractCodeBlock(node: any) {
  return node.content.map((child: any) => child.value || "").join("\n");
}

function renderRichText(content: any) {
  const assetMap = new Map();
  content?.links?.assets?.block?.forEach((asset: any) => {
    assetMap.set(asset.sys.id, asset);
  });

  // Pre-process the content to merge consecutive code blocks
  const processedContent = { ...content };
  if (processedContent.json?.content) {
    const mergedContent: any[] = [];
    let codeBlockBuffer: string[] = [];
    let inCodeBlock = false;

    processedContent.json.content.forEach((node: any, index: number) => {
      const isCodeParagraph =
        node.nodeType === "paragraph" &&
        node.content.every(
          (child: any) => child.marks?.some((mark: any) => mark.type === "code")
        );

      if (isCodeParagraph) {
        // Accumulate code lines
        const codeText = node.content.map((child: any) => child.value || "").join("");
        codeBlockBuffer.push(codeText);
        inCodeBlock = true;
      } else {
        // If we were in a code block, flush it
        if (inCodeBlock && codeBlockBuffer.length > 0) {
          mergedContent.push({
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: codeBlockBuffer.join("\n"),
                marks: [{ type: "code" }],
                data: {},
              },
            ],
            __isCodeBlock: true,
          });
          codeBlockBuffer = [];
          inCodeBlock = false;
        }
        // Add the non-code node
        mergedContent.push(node);
      }
    });

    // Flush any remaining code block
    if (inCodeBlock && codeBlockBuffer.length > 0) {
      mergedContent.push({
        nodeType: "paragraph",
        data: {},
        content: [
          {
            nodeType: "text",
            value: codeBlockBuffer.join("\n"),
            marks: [{ type: "code" }],
            data: {},
          },
        ],
        __isCodeBlock: true,
      });
    }

    processedContent.json.content = mergedContent;
  }

  const options: Options = {
    renderMark: {
      // Inline code (single line)
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="font-mono bg-gray-800 text-gray-100 px-1 py-0.5 rounded">
          {text}
        </code>
      ),
    },

    renderNode: {
      // Detect paragraph that actually contains a code block
      [BLOCKS.PARAGRAPH]: (node, children) => {
        const isCodeBlock =
          (node as any).__isCodeBlock ||
          node.content.every(
            (child: any) => child.marks?.some((mark: any) => mark.type === "code")
          );

        // MULTI-LINE CODE BLOCK (because Contentful does not support BLOCKS.CODE)
        if (isCodeBlock) {
          const codeText = extractCodeBlock(node);
          return <CodeBlock code={codeText} />;
        }

        // NORMAL PARAGRAPH
        return (
          <p className="text-gray-800 mb-6 leading-relaxed text-lg dark:text-white">
            {children}
          </p>
        );
      },

      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = assetMap.get(node.data.target.sys.id);
        if (!asset) return null;

        return (
          <div className="flex justify-center my-8">
            <Image
              src={asset.url}
              alt={asset.description || asset.title}
              width={900}
              height={500}
              className="rounded-2xl shadow-md object-cover max-w-full h-auto"
            />
          </div>
        );
      },

      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2 className="text-xl md:text-xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
          {children}
        </h2>
      ),

      [BLOCKS.HEADING_1]: (_node, children) => (
        <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
          {children}
        </h2>
      ),

      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
          {children}
        </blockquote>
      ),

      [INLINES.HYPERLINK]: (node, children) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      ),
    },
  };

  return documentToReactComponents(processedContent.json as Document, options);
}

export default renderRichText;
