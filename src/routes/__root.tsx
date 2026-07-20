import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { SITE } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ไม่พบหน้าที่คุณค้นหา / The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-outline-gold">Go home</a>
        </div>
      </div>
    </div>
  );
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Captain Barber",
  alternateName: "กัปตัน Barber",
  image: "/favicon.png",
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "99 Sukhumvit Rd.",
    addressLocality: "Bangkok",
    addressCountry: "TH",
  },
  openingHours: "Mo-Su 09:00-20:00",
  priceRange: "฿฿",
  sameAs: [SITE.facebook, SITE.lineUrl],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "กัปตัน Barber (Captain Barber) — ร้านตัดผมชาย เชี่ยวชาญ Fade" },
      {
        name: "description",
        content:
          "กัปตัน Barber ร้านตัดผมชายสไตล์ Classic × Modern เชี่ยวชาญ Fade ทรงผมสมัยใหม่ โกนหนวด ย้อมสี ราคาเริ่มต้น 80 บาท จองคิวออนไลน์ได้ทันที",
      },
      {
        name: "keywords",
        content:
          "ร้านตัดผมชาย, Barber, กัปตัน Barber, Captain Barber, Fade, ตัดผมชาย, โกนหนวด, ย้อมสีผมชาย, บาร์เบอร์, จองคิวตัดผม",
      },
      { name: "author", content: "Captain Barber" },
      { property: "og:site_name", content: "Captain Barber" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "กัปตัน Barber (Captain Barber)" },
      { property: "og:description", content: "กัปตันผู้นำเทรนด์ทรงผมเท่ ๆ ใกล้บ้านคุณ — จองคิวออนไลน์ได้เลย" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "กัปตัน Barber (Captain Barber)" },
      { name: "twitter:description", content: "ร้านตัดผมชาย เชี่ยวชาญ Fade — จองคิวออนไลน์" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Prompt:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgJsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            <Outlet />
          </main>
          <Footer />
          <FloatingButtons />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
