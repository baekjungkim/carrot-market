import type { NextPage } from "next";
import Layout from "../../components/layout";

const Chats: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar>
      <div className="divide-y-[1px] py-10">
        {[1, 1, 1, 1, 1].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 py-3 px-4">
            <div className="h-12 w-12 cursor-pointer rounded-full bg-slate-300 " />
            <div className="cursor-pointer ">
              <p className="text-gray-700">Steve Jebs</p>
              <p className="text-sm text-gray-500">내일 보자!</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
