'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function HomePage() {
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [rootDomain, setRootDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      console.log(host);
      // Decide root domain based on hostname
      if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('wfu.net')) {
        setRootDomain('wfu.net');
      } else if (host.includes('dev')) {
        setRootDomain('workforce.net');
      } else {
        setRootDomain('officeautomatedhub.com');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subdomainRegex = /^[a-zA-Z0-9-]{2,63}$/;

    if (!subdomain) {
      setError('Client ID is required.');
      return;
    } else if (!subdomainRegex.test(subdomain)) {
      setError('Invalid Client ID. Only letters, numbers, and hyphens allowed.');
      return;
    }

    setError('');
    window.location.href = `http://${subdomain}.${rootDomain}:3000/login`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Image src="/oahub_logo.png" alt="Office Automated Hub Logo" width={500} height={150} priority className="mb-8"
      />

      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md">
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <input type="text" placeholder="Client ID" value={subdomain || ''} onChange={(e) => setSubdomain(e.target.value)} className="flex-grow px-4 py-2 outline-none" name='client_id'/>
          <span className="px-2 flex items-center border-l border-gray-300 text-sm text-gray-700">
            .{rootDomain}
          </span>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="sign_in">
          Sign In
        </button>
      </form>
    </div>
  );
}
