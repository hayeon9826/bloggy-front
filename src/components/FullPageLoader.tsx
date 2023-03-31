import cn from "classnames";

export default function FullPageLoader({ className = "" }) {
  return (
    <div
      className={cn(
        "fixed w-full inset-x-0 h-screen flex flex-col justify-center bg-black/60 z-50",
        className
      )}
    >
      <div
        className="m-auto flex flex-col animate-spin w-10 h-10 border-[4px] border-current border-t-transparent text-blue-500 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
