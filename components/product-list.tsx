import Item from "@components/item";
import { ProductWithRecords } from "pages";
import useSWR from "swr";

interface Record {
  id: number;
  product: ProductWithRecords;
}
interface RecordsResponse {
  ok: boolean;
  records: Record[];
}

interface ProductListProps {
  kind: "favorites" | "sales" | "purchases";
}

const ProductList = ({ kind }: ProductListProps) => {
  const { data, error } = useSWR<RecordsResponse>(
    `/api/users/me/records?kind=${kind}`
  );
  return data ? (
    <>
      {data?.records?.map((record) => (
        <Item
          key={record.id}
          id={record.product.id}
          title={record.product.name}
          price={record.product.price}
          image={record.product.image}
          comments={1}
          hearts={record.product.records.length}
        />
      ))}
    </>
  ) : null;
};

export default ProductList;
