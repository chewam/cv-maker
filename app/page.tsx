import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Announcing our next round of funding.{" "}
            <a href="#" className="font-semibold text-indigo-600">
              <span className="absolute inset-0" aria-hidden="true"></span>
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Votre CV parfait, adapté à chaque offre d&apos;emploi
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Créez, éditez, et personnalisez votre CV pour maximiser vos chances
            de succès. Adaptez votre CV à chaque opportunité d&apos;emploi avec
            l&apos;aide de notre IA.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Button asChild>
                <a href="/dashboard">Accédez au Dashboard</a>
              </Button>
            ) : (
              <Button asChild>
                <a href="/login">Commencez maintenant</a>
              </Button>
            )}
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
