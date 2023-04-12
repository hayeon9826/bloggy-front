import cn from "classnames";

interface LayoutProps {
  children: React.ReactNode;
  classNames?: string;
}

export const Layout = ({ children, classNames }: LayoutProps) => {
  return <div className={cn("overflow-hidden w-full h-full relative flex", classNames)}>{children}</div>;
};
