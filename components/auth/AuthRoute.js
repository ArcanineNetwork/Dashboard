import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function AuthRoute({ children }) {
    return withPageAuthRequired(children);
}