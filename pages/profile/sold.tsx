import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { RecordsResponse } from "pages/profile/favorite";

const Sold: NextPage = () => {
  const { data, error } = useSWR<RecordsResponse>(
    "/api/users/me/records?kind=sales"
  );
  const isLoading = !data && !error;

  console.log(data);
  return (
    <Layout title="판매내역" hasTabBar isGoBack>
      <div className="flex flex-col space-y-5 divide-y">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Item
            id={i}
            key={i}
            title="iPhone 14"
            price={99}
            comments={1}
            hearts={1}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Sold;
