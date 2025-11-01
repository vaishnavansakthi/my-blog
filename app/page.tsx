 
import HeroLanding from "./components/HeroLanding"
import Navbar from "./components/Navbar";
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

  console.log("Fetched data:", data?.blogCollection?.items);

  const entries = data?.blogCollection?.items ?? [];

  return (
    <main>
      <Navbar />
      <HeroLanding />
      <BlogList entries={entries} />
    </main>
  );
}
