
import Profile from './Profile';
import Notifications from './Notifications';
import { Bars3Icon } from '@heroicons/react/20/solid'

import { classNames } from '@lib/utilities';

type HeaderProps = {
    open: boolean;
    sidebarToggle(open: (currentState) => boolean): void;
}

export default function Header({ open, sidebarToggle }: HeaderProps) {
    return (
        <div id="header" className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-center sm:justify-start">
                    <div className={ classNames("p-1 rounded white cursor-pointer", open ? 'bg-gray-600' : '')}>
                        <Bars3Icon width={20} onClick={() => sidebarToggle((currentState) => !currentState)} />
                    </div>
                    <div className="pl-5">Home</div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Notifications />

                    {/* Profile dropdown */}
                    <Profile />
                </div>
            </div>
        </div>
    )
}