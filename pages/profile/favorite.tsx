import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { Product, Record } from "@prisma/client";

interface ProductWithRecords extends Product {
  records: Record[];
}

export interface RecordsResponse {
  ok: boolean;
  products: ProductWithRecords[];
}

const Favorite: NextPage = () => {
  const { data, error } = useSWR<RecordsResponse>(
    "/api/users/me/records?kind=favorites"
  );
  const isLoading = !data && !error;
  console.log(data);

  return (
    <Layout title="관심목록" hasTabBar isGoBack>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product.records.length}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Favorite;
