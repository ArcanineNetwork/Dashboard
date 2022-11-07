import { SessionProvider } from "next-auth/react"

function CodeReviewApplication({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} baseUrl='https://dev.uncensored.tech/'>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default CodeReviewApplication
