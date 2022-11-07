import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Octokit } from "@octokit/rest";
import { useSession } from "next-auth/react";

const Context = createContext(null);

export function GithubContext({ children }) {
    const { data: session } = useSession();
    const octokit = useRef();
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        if(!session)
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
    }, [session]);

    const github = {
        repos,
        octokit: octokit.current,
    };

    return (
        <Context.Provider value={github}>{children}</Context.Provider>
    )
}

export function useGithubContext() {
    return useContext(Context);
}