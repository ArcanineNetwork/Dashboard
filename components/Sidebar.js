import { Disclosure } from "@headlessui/react";
import { HomeIcon, UserIcon, ChevronDownIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid'

const navigation = [
    { title: 'Dashboard', icon: <HomeIcon width={25} /> },
    { title: 'Users', icon: <UserIcon width={25} /> },
    {
        title: 'Profile Overview',
        items: [
            { title: 'Messages' },
            { title: 'Security' },
        ],
        icon: <UserIcon width={25} />
    },
];

const Menu = ({ items }) => {
    return (
        <div className="flex flex-col justify-start items-center w-full">
            {
                items.map(i => {
                    if(i.hasOwnProperty('items')) {
                        return <Section title={i.title} items={i.items} icon={i.icon} key={i.title} />
                    }
                    return (
                        <div key={i.title}>
                            <Item icon={i.icon} title={i.title} classes="flex justify-start items-center space-x-6 px-3 py-2 text-white rounded hover:text-white hover:bg-gray-700 w-full md:w-60" />
                        </div>
                    )
                })
            }
        </div>
    )
}

const Item = ({ icon, title, classes }) => {
    return (
        <button className={classes}>
            { icon }
            <p>{ title }</p>
        </button>
    )
}

const Section = ({ title, items, icon }) => {
    return (
        <div>
            <Disclosure>
                {
                    ({ open }) => (
                        <>
                            <Disclosure.Button className="flex justify-start items-center space-x-6 text-white rounded hover:text-white hover:bg-gray-700 rounded px-3 py-2 w-full md:w-60">
                                { icon }
                                <p>{ title }</p>
                                <ChevronDownIcon className={open ? 'rotate-180 transform transition' : 'transition'} width={25} />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                                <div>
                                    {
                                        items.map( ({ title, icon }) => <Item title={title} icon={icon} key={title} classes="flex justify-start items-center space-x-6 text-white rounded hover:text-white hover:bg-gray-700 rounded pl-10 py-2 w-full" />)
                                    }
                                </div>
                            </Disclosure.Panel>
                        </>
                    )
                }
            </Disclosure>
        </div>
    )
}

export default function Sidebar({ collapsed, close }) {
    return (
        <div className="xl:rounded-r transform xl:translate-x-0 ease-in-out transition duration-500 flex justify-start items-start h-full w-full sm:w-64 bg-gray-900 flex-col">
            <div className="xl:flex justify-between p-2 pl-6 items-center w-full">
                <p className="text-lg text-white">Developer Dashboard</p>
                <ChevronDoubleLeftIcon width={25} onClick={close} />
            </div>
            <Menu items={navigation} />
        </div>
    )
}