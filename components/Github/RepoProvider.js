import { cloneElement, useEffect, useState } from "react";
import { useGithubContext } from "./GithubContext";

export default function RepoProvider({ children }) {
    const { octokit } = useGithubContext();
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        if(!octokit) {
            return;
        }

        async function loadRepos() {
            const { data: repos } = await octokit.repos.listForAuthenticatedUser();
            setRepos(repos);
        }
        loadRepos();
    }, [octokit]);

    return cloneElement(children, {
        repos: repos
    });
}