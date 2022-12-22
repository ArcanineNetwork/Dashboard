import {
    Bars3Icon,
    CalendarIcon,
    HomeIcon,
    MagnifyingGlassCircleIcon,
    MapIcon,
    MegaphoneIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import GithubSignIn from "../components/GithubSignIn";
import { GithubContext } from '../components/Github/GithubContext';
import Layout from "../components/layout";

const navigation = [
    { name: 'Code Review', href: '#', icon: HomeIcon, current: true },
]

export default function Dashboard() {
    return (
        <Layout>
           <div>
               Dashboard
           </div>
        </Layout>
    )
}