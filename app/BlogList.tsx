/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
export default async function BlogList({ entries }: { entries: any[] }) {
  return (
    <div id="blogs" className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Blog Posts</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry._id}
            href={`/blog/${entry.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {entry.featuredImage && (
              <img
                src={entry.featuredImage.url}
                alt={entry.featuredImage.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
              <p className="text-gray-600 mb-4">
                {new Date(entry.publishedDate).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
