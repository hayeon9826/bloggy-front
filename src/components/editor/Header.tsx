import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { status, data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 w-full z-50">
      <nav className="flex items-center justify-between px-6 py-3 lg:px-8 max-w-5xl mx-auto" aria-label="Global">
        <div className="flex lg:flex-1 gap-4">
          <span className="-m-1.5">
            <Link href="/">
              <span className="sr-only">Your Company</span>
              <Image width={32} height={32} className="h-8 w-auto" src="/images/logo_white_lg.png" alt="" />
            </Link>
          </span>
          <div className="text-xs my-auto font-normal md:block hidden max-w-[200px] lg:max-w-[220px] whitespace-nowrap truncate">
            Draft in <b className="truncate">{session?.user?.email}</b>
          </div>
          {/* <div className="text-sm my-auto font-normal text-gray-500">Saved</div> */}
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
          <button
            type="submit"
            className="rounded-full bg-blue-600 py-1.5 px-2.5 text-xs font-light text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Publish
          </button>
          {status === "authenticated" && (
            <span className="text-xs font-light leading-6 text-gray-900">
              <Link href={`/profile/${session?.user?.email}`}>Profile</Link>
            </span>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <span className="-m-1.5">
              <Link href="/">
                <span className="sr-only">Your Company</span>
                <Image width={32} height={32} className="h-8 w-auto" src="/images/logo_white_lg.png" alt="" />
              </Link>
            </span>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
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
                      <Link href={`/profile/${session?.user?.email}`}>Profile</Link>
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
