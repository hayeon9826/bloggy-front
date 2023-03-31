import { LockClosedIcon } from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

export default function SignInPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const checkUser = useCallback(async () => {
    let isSuccess;
    try {
      const res = await axios.post("/api/authUser", { email: session?.user?.email });
      if (res && res?.data?.email) {
        isSuccess = true;
      } else {
        const data = {
          name: session?.user?.name,
          email: session?.user?.email,
        };
        await axios.post("/api/users", data);
        isSuccess = true;
      }
    } catch (err) {
      console.log(err);
    }
    if (isSuccess) router.replace("/", undefined, { shallow: true });
  }, [router, session]);

  useEffect(() => {
    if (status === "authenticated") {
      checkUser();
    }
  }, [checkUser, router, status]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 flex-col">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Image className="mx-auto h-24 w-auto" width={96} height={96} src="/images/logo_text_white.png" alt="Your Company" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a href="#" className="font-medium text-gray-600 hover:text-gray-500">
                start your 14-day free trial
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="text-white relative group flex bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                </span>
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
