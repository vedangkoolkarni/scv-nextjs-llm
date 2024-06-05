import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-blue-600 text-white fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-lg font-semibold">Hello Next</div>
        <nav>
          <Link href="/users">
            <span className="px-4 py-2 hover:bg-blue-700 rounded">Users</span>
          </Link>
          <Link href="/users/posts">
            <span className="px-4 py-2 hover:bg-blue-700 rounded">Posts</span>
          </Link>
          <Link href="/contact">
            <span className="px-4 py-2 hover:bg-blue-700 rounded">Contact</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
