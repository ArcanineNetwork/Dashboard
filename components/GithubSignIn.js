import {signIn, signOut, useSession} from "next-auth/react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useGithubContext } from './Github/GithubContext';
import RepoProvider from "./Github/RepoProvider";

export default function GithubSignIn() {
    const { repos } = useGithubContext();
    const { data: session } = useSession();

    if(!session) {
        return (
            <>
                <button onClick={() => signIn("github")}>
                    Sign in with Github
                </button>
            </>
        )
    }

    const RepoDropdown = ({ repos }) => {
        return (
            <Select value={repos[1]}>
                { repos.map( (r,idx) => <MenuItem key={idx} value=''>{r.name}</MenuItem>) }
            </Select>
        );
    }

    return (
        <>
            <Box sx={{ maxWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Choose Repo:</InputLabel>
                    <RepoProvider>
                        <RepoDropdown />
                    </RepoProvider>
                </FormControl>
            </Box>
            <p>
                Not {session.user.name || session.user.email}? Then
                Logout and login again
            </p>
            <button onClick={() => signOut()}>Logout</button> <br />
        </>
    );
}