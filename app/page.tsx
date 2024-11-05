import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center">
        hello world
        <ModeToggle />
      </div>
    </>
  );
}
