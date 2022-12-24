import create from 'zustand';
import Router from 'next/router'

async function listRepositories() {
    
}

const useGithubStore = create((set) => ({
    isSignedIn: async (user) => {
        console.log(user);
        // Router.push('https://github.com/login/oauth/authorize?client_id=c62959336e80231497bf');
    },
    repos:[],
    getRepos: async () => {
        const repos = await listRepositories();
        set({ repos });
    },
  }));

  export default useGithubStore;