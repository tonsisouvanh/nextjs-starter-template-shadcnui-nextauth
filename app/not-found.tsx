import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">LOGO</div>
        <h1 className="mb-4 text-4xl font-bold text-primary">Oops! Page Not Found</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          We couldn{"'"}t find the page you{"'"}re looking for. It might have been removed, renamed, or doesn{"'"}t
          exist.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
