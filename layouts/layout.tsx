import { makeJoinClassname } from "../libs/utils";

interface LayoutProps {
  title?: string;
  isGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  isGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  return (
    <div>
      <div className="fixed top-0 flex w-full items-center justify-center border-b bg-white py-3 text-lg font-medium text-gray-800">
        {title ? <span>{title}</span> : null}
      </div>
      <div className={makeJoinClassname("pt-16", hasTabBar ? "pb-16" : "")}>
        {children}
      </div>
      {hasTabBar ? (
        <nav className="fixed bottom-0 flex items-center justify-between border-t bg-white pb-10 pt-3 text-gray-800">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </nav>
      ) : null}
    </div>
  );
}
