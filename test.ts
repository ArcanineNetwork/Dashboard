import fs from "fs";
import path from "path";
import {App} from "@octokit/app";
import {Octokit} from "@octokit/rest";
import NodeGit from "nodegit";
import tar from 'tar';
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const devInstallationId = 32624498;
const devAppId = 275605;

const studentInstallationId = 32620931;

function writeRepoToCleanUp(repoName) {
    fs.appendFileSync(path.join(process.cwd(), 'tmpRepos.txt'), repoName + "\n");
}

function sleep() {
    return new Promise( (res, rej) => {
        setTimeout(() => {
            res(true);
        }, 5000);
    })
}

async function makeAsyncRequest(func, params, attempts=5) {
    try {
        const {data, status} = await func(params);
        if(status <= 300 && status >= 200)
            return data;
    } catch(err) {
        if(attempts === 0) {
            return false;
        }
        console.log('received ', err.status, 'attempting another request ', attempts);
        console.log(err.message);
        console.log(err);

        await sleep();
        return await makeAsyncRequest(func, params, --attempts);
    }
}

function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function createClient(installationId) {
    // read pem file
    const pem = fs.readFileSync(path.join(process.cwd(), 'local', 'github_app.pem'), 'utf-8');
    const ArcanineGithubClient = App.defaults({
        Octokit,
    });
    const arcanineClient = new ArcanineGithubClient({
        appId: devAppId,
        privateKey: pem,
        oauth: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        webhooks: {
            secret: 'secret'
        }
    });

    // Use the arcanineClient to get curriculum client and student Client
    let octokitClient = await arcanineClient.getInstallationOctokit(installationId);

    return octokitClient;
}

async function getInstallationAccessToken(installationId) {
    const pem = fs.readFileSync(path.join(process.cwd(), 'local', 'github_app.pem'), 'utf-8');
    const ArcanineGithubClient = App.defaults({
        Octokit,
    });
    const arcanineClient = new ArcanineGithubClient({
        appId: devAppId,
        privateKey: pem,
        oauth: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        webhooks: {
            secret: 'secret'
        }
    });

    const obj: any = await arcanineClient.octokit.auth({ type: "installation", installationId });
    return obj.token;
}

async function makeRepository(client, newRepoName) {
    // create new repo from template
    const newRepo = await makeAsyncRequest(client.rest.repos.createUsingTemplate, {
        template_owner: 'ArcanineNetwork',
        template_repo: 'hack-or-snooze',
        owner: 'ArcanineNetwork',
        name: newRepoName,
        include_all_branches: true,
    });

    writeRepoToCleanUp(newRepoName);

    return newRepo;
}

async function getDefaultBranch(client, repoName) {
    const getRepo = await makeAsyncRequest(client.rest.repos.get, {
        owner: 'ArcanineNetwork',
        repo: repoName,
    });
    return getRepo.template_repository.default_branch;
}

async function latestCommitSHA(client, repoName, branch) {
    const latestCommit = await makeAsyncRequest(client.rest.git.getRef, {
        owner: 'ArcanineNetwork',
        repo: repoName,
        ref: `heads/${branch}`,
    });
    return latestCommit.object.sha;
}

async function createBranch(client, repoName, branchName) {
    const newBranch = await makeAsyncRequest(client.rest.git.createRef, {
        owner: 'ArcanineNetwork',
        repo: repoName,
        ref: `refs/heads/${branchName}`,
        sha: latestCommitSHA,
    });

    return newBranch;
}

async function downloadRepository(client, repoName) {
    const downloadPath = path.join(process.cwd(), 'local', 'repo.tar');
    const extractPath = path.join(process.cwd(), 'local', 'reposource');
    const contents = await makeAsyncRequest(client.rest.repos.downloadTarballArchive, {
        owner: 'wolfymaster',
        repo: 'hack-or-snooze-student',
        ref: 'heads/master',
    });

    const buf = Buffer.alloc(contents.byteLength);
    const view = new Uint8Array(contents);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    };

    fs.writeFileSync(downloadPath, buf, {
        encoding: 'utf-8'
    });

    tar.extract({
        file: downloadPath,
        cwd: extractPath,
    });
}

async function cloneRepo(repo, token) {
    const cloneURL = `https://x-access-token:${token}@github.com/${repo}`;
    const cloneOptions = {
        fetchOpts: {
            callbacks: {
                certificateCheck: () => { return 1; },
                credentials: () => {
                    return NodeGit.Cred.userpassPlaintextNew(token, 'x-access-token');
                }
            }
        }
    };

    const cloneRepository = NodeGit.Clone.clone(cloneURL, path.join(process.cwd(), 'local', 'repo'), cloneOptions);

    return cloneRepository;
}

async function doit() {
    const newRepoName = makeid(5);

    const studentAccessToken = await getInstallationAccessToken(studentInstallationId); //'ghu_vSprN5JWGwtisQv8QUGlPGGgkQaoDr0iPKyA';
    const curriculumToken = await getInstallationAccessToken(devInstallationId);

    // console.log('student Token', studentAccessToken, 'curr token', curriculumToken);

    const client = await createClient(devInstallationId);
    const studentClient = await createClient(studentInstallationId);

    // const newRepo = await makeRepository(client, newRepoName);

    // const defaultBranch = await getDefaultBranch(client, newRepoName);

    // const latestCommitSHA = latestCommitSHA(client, newRepoName, defaultBranch);

    // const newBranch = createBranch(client, newRepoName, 'new-branch');

    // download student contents
    // await downloadRepository(client, '')

    // try and access student private repo
    // const user = await makeAsyncRequest(client.rest.users.getByUsername, {
    //     username: 'arcanineio',
    // });
    //
    // console.log('user:', user);


    // const repos = await makeAsyncRequest(client.rest.repos.get, {
    //     owner: 'arcanineio',
    //     repo: 'test'
    // });
    //
    // console.log(repos);

    // const studentClient = new Octokit({
    //     auth: studentAccessToken,
    // });
    //
    // const reposs = await makeAsyncRequest(studentClient.rest.repos.listForAuthenticatedUser, {
    //     per_page: 100
    // });
    //
    // console.log(reposs);
    //
    // reposs.forEach(repo => {
    //     console.log('reposs', repo.name, repo.visibility);
    // });

    // const repos = await makeAsyncRequest(client.rest.repos.listForOrg,{
    //     org: 'ArcanineNetwork',
    // });
    //
    // repos.forEach(repo => {
    //     console.log(repo.name)
    // })
    //
    // const repo = await makeAsyncRequest(client.rest.repos.get, {
    //     owner: 'ArcanineNetwork',
    //     repo: 'hack-or-snooze',
    // });
    //
    // console.log('repo', repo);


    // if repo does not exist, create it. Otherwise, do nothing
    try {
        fs.statSync(path.join(process.cwd(), 'local', 'repo'));
    } catch {
        // objective: clone student hack-or-snooze project
        await cloneRepo('arcanineio/hack-or-snooze', studentAccessToken);
    }

    const studentRepo = await NodeGit.Repository.open(path.join(process.cwd(), 'local', 'repo'));

    // get the remotes
    if( !(await studentRepo.getRemoteNames()).includes('upstream') ) {
            // set another remote to the template repo to get starter code
            const upstreamURL = `https://x-access-token:${curriculumToken}@github.com/ArcanineNetwork/hack-or-snooze`;
            const upstreamRemote = await NodeGit.Remote.create(studentRepo, 'upstream', upstreamURL);
    }

    // fetch to update remotes
    await studentRepo.fetch('upstream', {
        callbacks: {
            certificateCheck: () => { return 1; },
            credentials: () => {
                return NodeGit.Cred.userpassPlaintextNew(curriculumToken, 'x-access-token');
            }
        }
    });

    // checkout student's main/master branch
    await studentRepo.checkoutBranch('master');

   const headCommit = await studentRepo.getHeadCommit();

    // create the starter-code branch
    await studentRepo.createBranch('starter-code', headCommit, true);

    // checkout starter-code branch
    await studentRepo.checkoutBranch('starter-code');

    // upstream commit hash
    const upstreamCommit = await studentRepo.getReferenceCommit('refs/remotes/upstream/master');
    const upstreamTree = await upstreamCommit.getTree();


    // create a new commit
    const author = NodeGit.Signature.now('authorName', 'author@email.com');
    const committer = NodeGit.Signature.now('johndoe', 'johndoe@email.com');
    const message = 'This is a commit message';
    const starterCodeOid = await studentRepo.createCommit('refs/heads/starter-code', author, committer, message, upstreamTree, [headCommit]);

    // create student-code branch for changes
    await studentRepo.createBranch('student-code', starterCodeOid, true);

    // create a commit that re-applies changes
    const mainTree = await headCommit.getTree();
    const studentCodeOid = await studentRepo.createCommit('refs/heads/student-code', author, committer, message, mainTree, [starterCodeOid]);

    // push changes
    const originRemote = await studentRepo.getRemote('origin');
    // const errCode = await originRemote.push(['refs/heads/starter-code', 'refs/heads/student-code']);

    // if errCode == undefined, then no error

    // create pull request from student-code => starter-code
    const pullRequest = await makeAsyncRequest(studentClient.rest.pulls.create, {
        owner: 'arcanineio',
        repo: 'hack-or-snooze',
        head: 'student-code',
        base: 'starter-code',
        title: 'Code Review',
        body: '',
    });

    console.log(pullRequest);
}

doit();

// const studentRef = await makeAsyncRequest(octokitClient.rest.git.getRef, {
//     owner: 'wolfymaster',
//     repo: 'hack-or-snooze-student',
//     ref: `heads/master`,
// });
//
// console.log('studentRef', studentRef);
//
// const tree = await makeAsyncRequest(octokitClient.rest.git.getTree, {
//     owner: 'wolfymaster',
//     repo: 'hack-or-snooze-student',
//     tree_sha: 'ba221bb8f8ccb9bd5db575c6104ec34bb43e1480'
// });
//
// console.log('tree', tree);