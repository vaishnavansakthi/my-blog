/* eslint-disable @next/next/no-img-element */
import { GRAPHQL_ENDPOINT, ACCESS_TOKEN } from "../../constants/constants";
import renderRichText from "../../renderRichText";

async function getBlogBySlug(slug: string) {
  const query = `
    query ($slug: String!) {
      blogCollection(where: { slug: $slug }, limit: 1) {
        items {
          sys { id }
          title
          slug
          publishedDate
          featuredImage { url title }
          content {
            json
          }
        }
      }
    }
  `;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 },
  });
    
    console.log("Fetching blog with slug:", slug, res);

    const { data } = await res.json();
    console.log("Fetched blog data:", data);
  return data.blogCollection.items[0];
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    console.log("BlogDetail params:", slug);
  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  return (
    <article className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        {new Date(blog.publishedDate).toLocaleDateString()}
      </p>
      {blog.featuredImage && (
        <img
          src={blog.featuredImage.url}
          alt={blog.featuredImage.title}
          className="rounded-lg mb-8 w-full h-auto"
        />
      )}
      <div className="prose max-w-none">
              {/* Here you can render rich text with documentToReactComponents */}
         {renderRichText(blog.content)} 
      </div>
    </article>
  );
}
