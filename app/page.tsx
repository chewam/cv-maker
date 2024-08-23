import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 px-4">
          <h1 className="font-bold text-4xl mb-4">Welcome to Your App</h1>
          {user ? (
            <p>You are logged in. Visit the <a href="/protected" className="text-blue-600 hover:underline">protected page</a>.</p>
          ) : (
            <p>Please log in or sign up to access the full features of the app.</p>
          )}
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>Your custom footer content</p>
      </footer>
    </div>
  );
}
