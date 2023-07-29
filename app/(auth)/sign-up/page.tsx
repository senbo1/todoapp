import UserAuthForm from '@/components/UserAuthForm';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="max-w-sm mx-auto flex flex-col justify-center h-full gap-20">
        <Link
          href="/"
          className={buttonVariants({
            variant: 'ghost',
            className: 'self-start -ml-4',
          })}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Home
        </Link>
        <div className="w-full space-y-6">
          <h1 className="font-bold text-2xl tracking-tight underline underline-offset-2">
            Register!
          </h1>
          <UserAuthForm mode="register" />
        </div>
      </div>
    </div>
  );
};

export default page;
