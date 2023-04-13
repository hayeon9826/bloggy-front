import cn from "classnames";

interface LayoutProps {
  children: React.ReactNode;
  classNames?: string;
}

export const Layout = ({ children, classNames }: LayoutProps) => {
  return (
    <div
      className={cn("overflow-hidden w-full h-full relative flex", classNames)}
    >
      {children}
    </div>
  );
};

export const ChatListLayout = ({ children, classNames }: LayoutProps) => {
  return (
    <div className="flex h-full max-w-full flex-1 flex-col relative">
      <main className="bg-gray-800 w-full h-screen overflow-y-scroll">
        {children}
      </main>
    </div>
  );
};
