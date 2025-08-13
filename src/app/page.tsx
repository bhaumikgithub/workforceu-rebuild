'use client';

import { useState } from 'react';
import Image from "next/image";

export default function HomePage() {
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Regex for a valid subdomain: letters, numbers, hyphens, 2-63 chars
    const subdomainRegex = /^[a-zA-Z0-9-]{2,63}$/;

    if (!subdomain) {
      setError('Client ID is required.');
      return;
    } else if (!subdomainRegex.test(subdomain)) {
      setError('Invalid Client ID. Only letters, numbers, and hyphens allowed.');
      return;
    }

    // If valid, redirect
    setError('');
    window.location.href = `http://${subdomain}.wfu.net:3000/login`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Image src="/oahub_logo.png" alt="Office Automated Hub Logo" width={500} height={150} priority className="mb-8"/>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md">
        {/* Input with suffix */}
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <input 
            type="text" 
            placeholder="Client ID" 
             value={subdomain || ''} // ensure it's always a string
            onChange={(e) => setSubdomain(e.target.value)} 
            className="flex-grow px-4 py-2 outline-none"
          />
          <span className="px-2 flex items-center border-l border-gray-300 text-sm text-gray-700">
            .officeautomatedhub.com
          </span>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Submit button */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-4">
          Sign In
        </button>
      </form>
    </div>
  );
}
