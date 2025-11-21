
import HeroLanding from "./components/HeroLanding"
import BlogList from "./BlogList";

import { GRAPHQL_ENDPOINT, ACCESS_TOKEN } from "./constants/constants";
import { getAllBlogsQuery } from "./queries/queries";

export default async function Home() {
  // Fetch data from Contentful GraphQL API
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: getAllBlogsQuery }),
    // Optionally use `next: { revalidate: 60 }` in Next.js 13+
  });

  const { data } = await res.json();

  const entries = data?.blogCollection?.items ?? [];

  //   const mockBlogs = Array.from({ length: 200 }).map((_, i) => ({
  //   _id: `blog-${i}`,
  //   slug: `blog-${i}`,
  //   title: `Understanding React Concepts ${i + 1}`,
  //   description:
  //     "A deep dive into React patterns, component design, and modern hooks usage.",
  //   featuredImage: {
  //     url: `https://picsum.photos/seed/${i}/400/300`,
  //     title: `Blog Image ${i + 1}`,
  //   },
  //   publishedDate: new Date(Date.now() - i * 86400000).toISOString(),
  // }));

  return (
    <main>
      <HeroLanding />
      <BlogList entries={entries} />
    </main>
  );
}
