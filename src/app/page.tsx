import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background flex flex-col items-center justify-center text-center px-4 md:px-6">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              CineMood AI
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl dark:text-gray-400">
              Stop scrolling, start watching. Let our AI find the perfect movie for your exact mood.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Mood Analysis</h3>
                <p className="text-gray-400">
                  Type how you feel, and our AI understands the nuance to recommend genres that match.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Smart Recommendations</h3>
                <p className="text-gray-400">
                  We verify recommendations against real movie databases to ensure you get top-quality suggestions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Personalized Library</h3>
                <p className="text-gray-400">
                  Save your favorites and track your mood history to see what you've been watching.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 CineMood AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
