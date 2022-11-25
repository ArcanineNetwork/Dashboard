import '../styles/globals.css'
import { UserProvider, withPageAuthRequired } from '@auth0/nextjs-auth0';

function ArcaninePlatform({ Component, pageProps: { session, ...pageProps } }) {
  const AuthorizedComponent = withPageAuthRequired(Component);
  return (
    <UserProvider>
      <AuthorizedComponent {...pageProps} />
    </UserProvider>
  )
}

export default ArcaninePlatform
