/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import {
  BLOCKS,
  INLINES,
  MARKS,
  Document,
} from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";

function renderRichText(content: any) {
  const assetMap = new Map();
  content?.links?.assets?.block?.forEach((asset: any) => {
    assetMap.set(asset.sys.id, asset);
  });

  const options: Options = {
    renderMark: {
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono dark:bg-gray-800">
          {text}
        </code>
      ),
    },

    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="text-gray-800 mb-6 leading-relaxed text-lg dark:text-white">
          {children}
        </p>
      ),

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

  return documentToReactComponents(content.json as Document, options);
}

export default renderRichText;
