import { useEffect, useRef, useState } from 'react';
import Layout from "../components/layout";
import Box from '../components/box';
import Stepper from '../components/stepper';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Octokit } from "@octokit/rest";


import useGithubStore from '../lib/githubStore';

// figure out if we have a github accout
    // if yes.. continue
    // if no, login to github via auth0

export default function CodeReview() {
    const { user, isLoading } = useUser();
    const router = useRouter()
    const signedIn = useGithubStore(state => state.isSignedIn);
    const [token, setToken] = useState(null);
    const octokit = useRef();
    const [repos, setRepos] = useState([{ name: "Please Select A Repository" }]);
    const [selectedRepoIndex, setSelectedRepoIndex] = useState(0);

    function loginToGithub() {
        router.push('https://github.com/apps/arcanine-dev-bot/installations/new');
    }

    useEffect(() => {
        async function doit(code) {
            const response = await fetch(`/api/github/authorize?code=${code}`);
            const json = await response.json();
            console.log('json response', json);
            setToken(json.token);

            if(json.token) {
                octokit.current = new Octokit({
                    auth: json.token,
                    userAgent: 'skylight v1'
                });

                console.log('octokit', octokit.current);
                
                const { data: repos } = await octokit.current.rest.repos.listForAuthenticatedUser({ 
                    per_page: 100,
                    affiliation: 'owner',
                });
                setRepos(repos);
                setSelectedRepoIndex(0)
            }
        }

        if(router.query?.code) {
            console.log('i haz code: ', router.query.code);
            doit(router.query.code);
        }
    }, [])

    useEffect(() => {
        if(isLoading) {
            return;
        }

        signedIn(router.asPath);

    }, [isLoading]);

    console.log('repos', repos);

    function handleChange({ target }) {
        console.log(target.value);
        setSelectedRepoIndex(target.value);
    }

    async function doReview() {
        const repo = repos[selectedRepoIndex];
        const repoName = repo.name;
        const userId = user.sub

        const response = await fetch('/api/github/start', {
            method: 'post',
            body: JSON.stringify({
                repository_owner: repo.owner.login,
                repository_name: repoName,
              token
            })
        });

        const json = await response.json();

        console.log(json);
    }

    const step1 = {
        title: 'User info',
        description: 'Step details here',
        component: () => {
            return (
                <div>Step 1</div>
            );
        },
    };

    const step2 = {
        title: 'Company Info',
        description: 'Step details here',
        component: () => {
            return (
                <div>Step 2</div>
            );
        },
    };

    const step3 = {
        title: 'Payment Info',
        description: 'Step details here',
        component: () => {
            return (
                <div>Step 3</div>
            );
        },
    };

    const steps = [step1, step2, step3];

    return (
        <Layout>
            <Box title='Code Review'>
                <Stepper steps={steps }/>
                <button className="bg-blue-500 p-4" onClick={loginToGithub}>
                    Login to GitHub
                </button>
                <div className="relative mx-auto">
                    <div>
                        Choose a project to review:
                    </div>

                    <div>
                        <Select value={selectedRepoIndex} onChange={handleChange} className="bg-white">
                            { repos.map( (r,idx) => <MenuItem key={idx} value={idx}>{r.name}</MenuItem>) }
                        </Select>
                    </div>

                    <div>
                        Choose Repository:
                    </div>

                    <div id="code-review-details" className="p-10">
                        <ul>
                            <li>The project starter code will be checked out into a new repository</li>
                            <li>A pull request will be created containing your changes from teh selected repository</li>
                            <li>Your mentor will be notified of your request for code review</li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <button className="inline-flex justify-center rounded-md px-4 py-2 bg-indigo-600" onClick={doReview}>Request Code Review</button>
                    </div>
                </div>
            </Box>
        </Layout>
    )
}