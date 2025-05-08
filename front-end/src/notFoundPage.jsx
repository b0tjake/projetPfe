import React from "react";
import "./glitch.css"; // we'll define this CSS file below

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="glitch text-6xl font-extrabold text-white mb-4" data-text="404">
          404
        </h1>
        <p className="text-gray-400 text-xl mb-6">Page Not Found</p>
        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-full shadow hover:bg-red-700 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
