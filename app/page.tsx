import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import AuthButton from "@/components/AuthButton"
import Logo from "@/components/logo"

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex flex-col lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">CV Maker</span>
              <Logo />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Produit
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Témoignages
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Comment ca marche ?
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Découvrez nos plans
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <AuthButton />
          </div>
        </nav>
      </header>

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
              Créez, éditez, et personnalisez votre CV pour maximiser vos
              chances de succès. Adaptez votre CV à chaque opportunité
              d&apos;emploi avec l&apos;aide de notre IA.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button asChild>
                  <a href="/dashboard">Go to Dashboard</a>
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
    </>
  )
}
