/* eslint-disable @next/next/no-img-element */
import { GRAPHQL_ENDPOINT, ACCESS_TOKEN } from "../../constants/constants";
import BlogContent from "../../components/BlogContent"; // Client Component

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
          content { json links { assets { block { sys { id } url title description } } } }
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

  const { data } = await res.json();
  return data.blogCollection.items[0];
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ unwrap Promise properly
  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  return <BlogContent blog={blog} />;
}
