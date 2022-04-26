import { NextPage } from "next";
import Layout from "../../components/layout";

const Write: NextPage = () => {
  return (
    <Layout title="질문 등록" isGoBack>
      <form className="px-4">
        <textarea
          id="description"
          rows={4}
          className="mt-1 w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          placeholder="Ask a question!"
        />
        <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default Write;
