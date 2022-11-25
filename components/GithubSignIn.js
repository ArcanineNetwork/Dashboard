import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useUser } from '@auth0/nextjs-auth0';
import { useGithubContext } from './Github/GithubContext';
import RepoProvider from "./Github/RepoProvider";
import Link from 'next/link';

export default function GithubSignIn() {
    const { repos } = useGithubContext();
    const { user, error, isLoading } = useUser();

    if(!user) {
        return (
            <>
                <button>
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
                Not {user.name || user.email}? Then
                Logout and login again
            </p>
            <button><Link href="/api/auth/logout">Logout</Link></button> <br />
        </>
    );
}