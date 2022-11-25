import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Octokit } from "@octokit/rest";
import { useUser } from '@auth0/nextjs-auth0';

const Context = createContext(null);

export function GithubContext({ children }) {
    const { user, error, isLoading } = useUser();
    const octokit = useRef();
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        if(!user)
            return

        octokit.current = new Octokit({
            auth: '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',
            userAgent: 'skylight v1'
        });

        // async function onLoad() {
        //     const { data: repos } = await octokit.current.repos.listForAuthenticatedUser();
        //     setRepos(repos);
        // }
        //
        // onLoad();
    }, [user]);

    const github = {
        repos,
        octokit: octokit.current,
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <Context.Provider value={github}>{children}</Context.Provider>
    )
}

export function useGithubContext() {
    return useContext(Context);
}