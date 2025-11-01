export default function HeroLanding() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg md:text-2xl mb-8">
          Sharing insights, stories, and ideas on web development and technology.
        </p>
        <a
          href="#blogs"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Explore Blogs
        </a>
      </div>
    </section>
  );
}