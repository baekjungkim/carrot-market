import { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

const Write: NextPage = () => {
  return (
    <Layout title="질문 등록" isGoBack>
      <form className="space-y-4 p-4">
        <TextArea required placeholder="Ask a question!" />
        <Button text="Save" />
      </form>
    </Layout>
  );
};

export default Write;
