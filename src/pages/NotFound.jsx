import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">✈️</div>
      <h1 className="text-6xl font-bold text-teal-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Looks like this destination doesn't exist. The page you're looking for
        may have been moved, deleted, or never existed.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/listings"
          className="border border-teal-700 text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Browse Packages
        </Link>
      </div>
    </div>
  );
}
