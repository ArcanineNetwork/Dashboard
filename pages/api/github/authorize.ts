async function authorize(req, res) {
    const { code } = req.query;

    console.log('code', code);
 
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'https://dev.arcanine.io/codereview',
    };
    const query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const response = await fetch('https://github.com/login/oauth/access_token?' + query, {
        headers:{
            accept: 'application/json',
        },
    });

    const json = await response.json();

    console.log('json', json);

    if(json.access_token) {
        console.log(json.access_token);
    }

    res.json({
        token: json.access_token,
    })
}

export default authorize;
