import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {GithubContext} from "./Github/GithubContext";
import GithubSignIn from "./GithubSignIn";

import {Fragment, useState} from 'react'
import {Dialog, Disclosure, Transition} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import Header from "./Header";

export default function Layout({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="relative flex h-full flex-col">
            <div className="bg-gray-800 sidebar-blue">
                <Header open={sidebarOpen} sidebarToggle={setSidebarOpen} />
            </div>

            <div className="flex h-full">
                <Transition show={ sidebarOpen }>
                    <Disclosure defaultOpen={true}>
                        {
                            ({ open , close}) => (
                                <Disclosure.Panel className="flex h-full">
                                    <div className="flex h-full">
                                        {/* Static sidebar for desktop */}
                                        <div className="hidden lg:flex lg:flex-shrink-0">
                                            <div className="flex w-64 flex-col">
                                                <Sidebar collapsed={!open} close={close} />
                                            </div>
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            )
                        }
                    </Disclosure>
                </Transition>

                <div className="relative z-0 flex flex-1 overflow-hidden">
                    <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                        {/* Start main area*/}
                        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                            <div className="h-full">
                                { children }
                            </div>
                        </div>
                        {/* End main area */}
                    </main>

                    <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
                        {/* Start secondary column (hidden on smaller screens) */}
                        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                            <div className="h-full" />
                        </div>
                        {/* End secondary column */}
                    </aside>
                </div>
            </div>
        </div>
    )
}