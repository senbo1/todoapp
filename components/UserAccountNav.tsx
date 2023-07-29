'use client';

import { Session } from 'next-auth';
import { FC } from 'react';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface UserAccountNavProps {
  session?: Session | null;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ session }) => {
  return (
    <div>
      {session?.user ? (
        <Button onClick={() => signOut()}>Sign Out</Button>
      ) : (
        <Link href="/sign-in" className={buttonVariants({ size: 'sm' })}>
          Sign In
        </Link>
      )}
    </div>
  );
};

export default UserAccountNav;
