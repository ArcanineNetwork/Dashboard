import { App, createNodeMiddleware } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import fs from 'fs';
import path from 'path';

const devInstallationId = 32511747;
const devAppId = 275605;

async function start(req, res) {
    const json = JSON.parse(req.body);

    console.log(json.repository_owner, json.repository_name);

    // read pem file
    const pem = fs.readFileSync(path.join(process.cwd(), 'local', 'github_app.pem'), 'utf-8');



    const myApp = App.defaults({
        Octokit,
    });

    const app = new myApp({
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

    // let { data: tokenResponse } = await app.octokit.rest.apps.createInstallationAccessToken({
    //     installation_id: 32511747,
    // });
    //
    // console.log(tokenResponse);
    //
    // let { data: appResponse } = await app.octokit.rest.apps.getAuthenticated();
    //
    // console.log('appResponse', appResponse);
    //
    // const accessToken = tokenResponse.token;
    //
    // const client = new Octokit({
    //     auth: accessToken,
    // });

    let octokitClient = await app.getInstallationOctokit(devInstallationId);

    let { data: testResponse } = await octokitClient.request(`GET /repos/${json.repository_owner}/${json.repository_name}`);

    let { data: arcanineResponse } = await octokitClient.rest.repos.get({
        owner: 'ArcanineNetwork',
        repo: 'hack-or-snooze',
    });

    console.log(arcanineResponse);

    // create new repo from template
    await octokitClient.rest.repos.createUsingTemplate({
        template_owner: 'ArcanineNetwork',
        template_repo: 'hack-or-snooze',
        owner: 'ArcanineNetwork',
        name: 'a2',
    });

    // share make a PR from their repo against the new repo
    await octokitClient.rest.pulls.create({
        owner,
        repo,
        head,
        base,
    });
}

export default start;
