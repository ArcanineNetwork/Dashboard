import { Octokit } from "@octokit/rest";
import { createAppAuth, createOAuthUserAuth } from "@octokit/auth-app";

class Github {
    static clientFromApplication() {
        return new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: 1,
                privateKey: process.env.GITHUB_APP_KEY,
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
        });
    }

    static clientFromAccessToken(access_token) {
        return new Octokit({
            auth: access_token,
        });
    }
}

export default Github;
