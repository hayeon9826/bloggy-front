import { useCallback, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { createCookie, getCookieValue } from "@/hooks/useCookie";

export default function Banner() {
  const [isShow, setIsShow] = useState<boolean>(true);
  const router = useRouter();
  const handleClickBanner = () => {
    router.push("/pricing");
  };

  const handleCloseBanner = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    createCookie("bannerClose", "close", date);
    setIsShow(false);
  }, []);

  useEffect(() => {
    const value = getCookieValue("bannerClose");
    setIsShow(!value);
  }, []);

  return isShow ? (
    <div
      role="presentation"
      className="w-full isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 py-2.5 px-6 sm:px-3.5 sm:before:flex-1 border-b border-gray-200 fixed top-[60px] z-50"
    >
      <svg
        viewBox="0 0 577 310"
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
      >
        <path
          id="a906133b-f855-4023-a54c-38d70c72fe9c"
          fill="url(#be47b6c9-9c22-49b2-a209-168b52fa0ada)"
          fillOpacity=".3"
          d="m142.787 168.697-75.331 62.132L.016 88.702l142.771 79.995 135.671-111.9c-16.495 64.083-23.088 173.257 82.496 97.291C492.935 59.13 494.936-54.366 549.339 30.385c43.523 67.8 24.892 159.548 10.136 196.946l-128.493-95.28-36.628 177.599-251.567-140.953Z"
        />
        <defs>
          <linearGradient
            id="be47b6c9-9c22-49b2-a209-168b52fa0ada"
            x1="614.778"
            x2="-42.453"
            y1="26.617"
            y2="96.115"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#c3bffd" />
            <stop offset={1} stopColor="#ffb6d5" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 577 310"
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
      >
        <use href="#a906133b-f855-4023-a54c-38d70c72fe9c" />
      </svg>
      <p
        className="text-sm leading-6 text-gray-900"
        role="presentation"
        onClick={handleClickBanner}
      >
        <a href="#">
          <strong className="font-semibold">Get membership</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Get unlimited access to all of Bloggy for less than $1/week.&nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleCloseBanner}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
