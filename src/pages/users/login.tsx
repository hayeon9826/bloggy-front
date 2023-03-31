import { LockClosedIcon } from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 flex-col bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                start your 14-day free trial
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-4 text-base font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Google Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
