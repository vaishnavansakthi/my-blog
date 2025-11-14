import { GRAPHQL_ENDPOINT, ACCESS_TOKEN } from "../constants/constants";
import BlogContent from "../components/BlogContent";

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
          description
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

// ✅ NEW: Dynamic metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog not found",
      description: "The blog you are looking for does not exist.",
    };
  }

  return {
    title: `${blog.title} | My Blog`,
    description:
      blog.description ||
      `Read more about ${blog.title} and discover insights from our latest post.`,
    openGraph: {
      title: blog.title,
      description:
        blog.description ||
        `Read more about ${blog.title} and discover insights from our latest post.`,
      images: [
        {
          url: blog.featuredImage?.url || "/default-og.png",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
  };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  return <BlogContent blog={blog} />;
}
