import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="bg-white transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 select-none"
        >
          Vaishnavan<span className="text-pink-500">M</span> Blog&apos;s
        </Link>
      </div>
    </nav>
  );
}
