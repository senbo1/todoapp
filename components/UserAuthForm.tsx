'use client';

import { FC, useState } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import Icons from './Icons';
import { Input } from './ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import axios, { AxiosError } from 'axios';

interface Props {
  mode: 'register' | 'signin';
}

const registerContent = {
  footerText: 'Already have an account?',
  footerUrl: '/sign-in',
  footerLinkText: 'Sign In',
  buttonText: 'Sign Up'
};

const signInContent = {
  footerText: 'Not Registered?',
  footerUrl: '/sign-up',
  footerLinkText: 'Sign Up',
  buttonText: 'Sign In'
};

const initial = { email: '', password: '', name: '' };

const UserAuthForm: FC<Props> = ({ mode }) => {
  const [formState, setFormstate] = useState({ ...initial });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        await axios.post('/api/register', formState);
        router.push('/sign-in');
        toast({
          title: "Succesfully Registered",
        })
      } else {
        await signIn('credentials', { ...formState });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast({
            title: 'Email already exists',
            description: 'Please choose a different name.',
            variant: 'destructive'
          })
        } else if (error.response?.status === 422) {
          toast({
            title: `Invalid ${error.response?.data[0].path[0]}`,
            description: `${error.response?.data[0].message}`,
            variant: 'destructive',
          })
        } else if (error.response?.status === 500) {
          toast({
            title: 'Server Error',
            variant: 'destructive',
          })
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'There was an error signing in, try again',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormstate((s) => ({ ...s, [name]: value }));
  };

  const content = mode === 'register' ? registerContent : signInContent;

  return (
    <div className="flex flex-col justify-center gap-4 w-full">
      <form className="space-y-2" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <Input
            type="text"
            placeholder="Name"
            value={formState.name}
            name="name"
            onChange={onChange}
            required
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={formState.email}
          name="email"
          onChange={onChange}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={formState.password}
          name="password"
          onChange={onChange}
          required
        />
        <Button className="w-full" isLoading={isLoading} disabled={isLoading}>{content.buttonText}</Button>
      </form>
      <Button onClick={signInWithGoogle} isLoading={isLoading} disabled={isLoading}>
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />} Google
      </Button>
      <p>
        {content.footerText}
        <span className="text-muted-foreground underline underline-offset-1">
          <Link href={content.footerUrl}>{content.footerLinkText}</Link>
        </span>
      </p>
    </div>
  );
};

export default UserAuthForm;
