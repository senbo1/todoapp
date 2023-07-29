import { FC } from 'react';
import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';

const Navbar: FC = async () => {
  const session = await getAuthSession();
  return (
    <nav className="fixed top-0 inset-x-0 h-fit border-b z-[10] py-2">
      <div className="h-full flex items-center justify-between px-6">
      <Link href='/' className='font-bold text-xl hover:bg-foreground hover:text-background px-2 -ml-2 cursor-pointer transition-all'>TODOS!</Link>
      <UserAccountNav session={session} />
      </div>
    </nav>
  );
};

export default Navbar;
