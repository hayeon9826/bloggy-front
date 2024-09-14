import { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BsPencilSquare } from "react-icons/bs";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const { status, data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const query = (event.currentTarget as HTMLInputElement).value.trim(); // Get the input value
        if (query) {
          router.push(`/?search=${encodeURIComponent(query)}`);
        } else {
          router.push(`/`);
        }
      }
    },
    [router]
  );

  return (
    <header className="bg-white border-b border-gray-200 w-full z-50 fixed top-0 h-[54px]">
      <nav
        className="flex items-center justify-between px-6 py-3 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 gap-4">
          <div className="-m-1.5 p-1.5">
            <Link href="/">
              <span className="sr-only">Your Company</span>
              <Image
                width={32}
                height={32}
                className="h-8 w-auto"
                src="/images/logo_white_lg.png"
                alt=""
              />
            </Link>
          </div>
          <div>
            <div>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-full border-0 focus:ring-0 px-6 py-1.5 text-gray-900 bg-gray-50 placeholder:text-gray-500 placeholder:font-light sm:text-sm sm:leading-6"
                placeholder="Search Bloggy"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          {status === "authenticated" && (
            <span className="text-sm font-light leading-6 text-gray-900 hover:text-blue-600 hover:stroke-blue-600 flex gap-2">
              <Link href="/posts/new">Write</Link>
              <BsPencilSquare className="my-auto text-gray-500 hover:text-blue-600 cursor-pointer" />
            </span>
          )}
          {status === "authenticated" && (
            <span className="text-sm font-light leading-6 text-gray-900 hover:text-blue-600">
              <Link href={`/profile/${session?.user?.email}`}>Profile</Link>
            </span>
          )}
          {status === "authenticated" && (
            <span className="text-sm font-light leading-6 text-gray-900 hover:text-blue-600">
              <Link href={`/chats`}>Chat</Link>
            </span>
          )}
          {status === "authenticated" ? (
            <span className="text-sm font-light leading-6 text-gray-900 hover:text-blue-600">
              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Log out
              </button>
            </span>
          ) : (
            <span className="text-sm font-light leading-6 text-gray-900 hover:text-blue-600">
              <Link href="/api/auth/signin">
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-[100] w-full overflow-y-auto bg-white px-6 py-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                width={32}
                height={32}
                className="h-8 w-auto"
                src="/images/logo_white_lg.png"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                <span className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-light leading-7 text-gray-900 hover:bg-gray-50">
                  {status === "authenticated" && (
                    <div className="mb-2">
                      <Link href={`/profile/${session?.user?.email}`}>
                        Profile
                      </Link>
                    </div>
                  )}
                  {status === "authenticated" ? (
                    <button
                      type="button"
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                    >
                      Log out
                    </button>
                  ) : (
                    <Link href="/api/auth/signin">Log in</Link>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
