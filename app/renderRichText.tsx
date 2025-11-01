/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function renderRichText(content: any) {
  const assetMap = new Map();
  content?.links?.assets?.block?.forEach((asset: any) => {
    assetMap.set(asset.sys.id, asset);
  });

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
      ),

      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = assetMap.get(node.data.target.sys.id);
        if (!asset) return null;

        return (
          <div className="my-6 flex justify-center">
            <Image
              src={asset.url}
              alt={asset.description || asset.title}
              width={700}
              height={400}
              className="rounded-xl shadow-md max-w-full h-auto"
            />
          </div>
        );
      },

      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
      ),

      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      ),
    },
  };

  return documentToReactComponents(content.json as Document, options);
}

export default renderRichText;