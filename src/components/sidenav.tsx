import { FC } from 'react';
import Link from 'next/link';

const Sidenav: FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 bg-white w-64 shadow-lg z-20 text-black">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Navigation</h2>
      </div>
      <nav className="mt-4">
        <Link href="/users">
          <span className="block px-4 py-2 hover:bg-gray-200">Home</span>
        </Link>
        <Link href="/about">
          <span className="block px-4 py-2 hover:bg-gray-200">About</span>
        </Link>
        <Link href="/contact">
          <span className="block px-4 py-2 hover:bg-gray-200">Contact</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidenav;
