"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/logo.png';
import { Menu, MenuButton, Transition, MenuItems, MenuItem } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';

const Header = () => {
    // Example state for notification count
    const [notificationCount, setNotificationCount] = useState(1); // Replace with your actual notification count state

    return (
        <header className="bg-gray-100 text-black p-4 flex justify-between items-center">
            <div className="flex items-center">
                <Image src={logo} alt="Logo" width={110} height={50} />
            </div>
            <span className="ml-2 text-md font-bold">Task Manager</span>
            <div className="relative flex items-center">
                <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {/* Notification count */}
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 py-0.5 text-xs font-bold">
                            {notificationCount}
                        </span>
                    )}
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                    {/* Dropdown button */}
                    <div>
                        <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <Image
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="User profile"
                                width={32}
                                height={32}
                            />
                        </MenuButton>
                    </div>
                    {/* Dropdown content */}
                    <Transition
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <MenuItem>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                                    Your Profile
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                                    Settings
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                                    Sign out
                                </a>
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Header;
