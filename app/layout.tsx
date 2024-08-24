import { GeistSans } from "geist/font/sans"
import "./globals.css"
import BackgroundEffect from "@/components/background-effect"
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Your App Name",
  description: "Description of your app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center relative isolate">
          <BackgroundEffect />
          <Header />
          {children}
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
