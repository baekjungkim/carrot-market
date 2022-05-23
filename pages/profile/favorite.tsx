import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Favorite: NextPage = () => {
  return (
    <Layout title="관심목록" hasTabBar isGoBack>
      <div className="flex flex-col space-y-5 divide-y">
        <ProductList kind="favorites" />
      </div>
    </Layout>
  );
};

export default Favorite;
