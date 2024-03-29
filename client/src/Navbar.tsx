import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import httpClient from './httpClient';
import { User } from './types';

const navigation = [
  { name: 'Strona główna', href: '/', current: false },
  { name: 'Wyniki', href: '/scores', current: false },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>(''); // State for active tab

  useEffect(() => {
    (async () => {
      if(localStorage.getItem("accessToken"))
       {
         try {
           const resp = await httpClient.get("https://flask-back-cj5j.onrender.com/@me", {
             headers: {"Authorization": `Bearer ${localStorage.getItem("accessToken")}`}
           });
           setUser(resp.data);
         } catch (error) {
           console.log("Not authenticated");
         }
       }
    })();
  }, []);

  const logoutUser = async () => {
    localStorage.removeItem("accessToken")
    window.location.href = "/";
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName); // Update active tab state on click
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <Disclosure.Button                 
                  className={classNames(
                  'relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white',
                  // Hide on larger screens using media query
                  'sm:block md:hidden'
                )}>
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          activeTab === item.name ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={activeTab === item.name ? 'page' : undefined}
                        onClick={() => handleTabClick(item.name)} // Update active tab on click
                      >
                        {item.name}
                      </a>
                    ))}
                    {user != null ? (
                      <div>
                        <a href='/quizes'>
                          <button
                          key="quiz"
                          className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium mr-3'
                          )}
                          >
                          Quiz
                          </button>
                        </a>
                        <button
                          key="Logout"
                          onClick={logoutUser}
                          className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          Wyloguj
                        </button>
                      </div>
                    ) : (
                      <a
                        key="Login"
                        href="/login"
                        className={classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        Zaloguj
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    activeTab === item.name ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={activeTab === item.name ? 'page' : undefined}
                  onClick={() => handleTabClick(item.name)} // Update active tab on click
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}