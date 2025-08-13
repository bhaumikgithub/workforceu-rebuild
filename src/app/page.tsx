'use client';

import { useState } from 'react';
import Image from "next/image";

export default function HomePage() {
  const [subdomain, setSubdomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subdomain) {
      window.location.href = `http://${subdomain}.wfu.net:3000/login`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Logo */}
      <Image src="/oahub_logo.png" alt="Office Automated Hub Logo" width={500} height={150} priority className="mb-8"/>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        {/* Input with suffix */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <input type="text" placeholder="Client ID" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="flex-grow px-4 py-2 outline-none"
            required
          />
          <span className="px-2 flex items-center bg-gray-200 border-l border-gray-300 text-sm text-gray-700">
            .officeautomatedhub.com
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-4"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
