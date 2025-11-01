/* eslint-disable @next/next/no-html-link-for-pages */
export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-800">
          My Blog
        </a>
        <div>
          <a
            href="#blogs"
            className="text-gray-600 hover:text-gray-800 mx-4 transition duration-300"
          >
            Blogs
          </a>
          <a
            href="#about"
            className="text-gray-600 hover:text-gray-800 mx-4 transition duration-300"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-gray-800 mx-4 transition duration-300"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}