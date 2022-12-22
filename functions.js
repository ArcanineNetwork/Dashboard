async function getAuth0ManagementToken() {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'v6yUzDLNrbbVj9dpOXJfuw4ApsX6NDv7',
            client_secret: 'E1NSEZirSbVsqlBbwIpmc5FnvdN9GIgyvrOog0i2oLK9T2g56koihGqrEq43jqka',
            audience: 'https://arcanine-platform-dev.us.auth0.com/api/v2/',
            scope: 'read:users read:user_idp_tokens',
        }),
    };

    const response = await fetch('https://arcanine-platform-dev.us.auth0.com/oauth/token', options);
    const { error, error_description, access_token } = await response.json();

    if(error) {
        throw new Error(`${error}: ${error_description}`);
    }

    return access_token;
}

async function getUserAccessToken(connection) {
    const token = await getAuth0ManagementToken();
    const ManagementClient = require('auth0').ManagementClient;
    const management = new ManagementClient({
        token: token,
        domain: 'arcanine-platform-dev.us.auth0.com',
    });

    const user = await management.getUser({ id: 'oauth2|discord|298664489992323084'});

    return user.identities.find(i => i.connection === connection);
}

async function getAuthorizedClient(clientName) {
    const clientAccessToken = await getUserAccessToken(clientName);

}

async function run() {
    // get a source control client authorized for the current user
    const client = getAuthorizedClient('github');

    // which project are we creating a review for?

    // get the repo location of the starter code for the project

    // create a new tmp repo for the student

    // clone the starter code into the new tmp repo

    // create PR from the student's repo against the new repo



    // share the repo with the mentor's github account

// share the repo with the student's github account
}

run();
