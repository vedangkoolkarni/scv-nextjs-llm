import Header from '@/components/header';
import { FC, ReactNode } from 'react';
import Sidenav from '@/components/sidenav';

interface UsersLayoutProps {
  children: ReactNode;
}

const UsersLayout: FC<UsersLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidenav />
        <main className="bg-white ml-64 pt-16 flex-1 h-screen">{children}</main>
      </div>
    </>
  );
};

export default UsersLayout;
