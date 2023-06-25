import "ui/styles.css";
import { Bowlby_One_SC, Roboto_Mono } from "next/font/google";
import { NextIntlProvider } from "next-intl";
import { trpc } from "../utils/trpc";
import { AuthContextProvider } from "../components/Auth";

const bowlby = Bowlby_One_SC({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bowlby",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  weight: ["400"],
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }) {
  return (
    <NextIntlProvider messages={pageProps.messages} locale={pageProps.locale}>
      <AuthContextProvider>
        <main
          className={`${bowlby.variable} ${robotoMono.variable} bg-main-theme text-white`}
        >
          <Component {...pageProps} />
        </main>
      </AuthContextProvider>
    </NextIntlProvider>
  );
}

export default trpc.withTRPC(MyApp);
