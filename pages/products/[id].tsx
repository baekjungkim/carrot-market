import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const isLoading = !data && !error;

  return (
    <Layout
      title={isLoading ? "Loading..." : data?.product?.name}
      hasTabBar
      isGoBack
    >
      <div className="px-4 py-4">
        <div className="mb-5">
          <div
            className={`h-96 bg-slate-300 ${isLoading ? "animate-pulse" : ""}`}
          />
          <div className="flex items-center space-x-3 border-b py-3">
            <div
              className={`h-12 w-12 cursor-pointer rounded-full bg-slate-300 ${
                isLoading ? "animate-pulse" : ""
              }`}
            />
            <div className="cursor-pointer ">
              <p className="font-demidum text-sm text-gray-700">
                {isLoading ? "Loading..." : data?.product?.user?.name}
              </p>
              {isLoading ? null : (
                <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                  <a className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-5">
            {isLoading ? (
              <h1 className="my-6 text-3xl font-bold text-gray-900">
                Loading...
              </h1>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  {data?.product?.name}
                </h1>
                <span className="mt-3 block text-2xl text-gray-900">
                  {data?.product?.price} 원
                </span>
                <p className="my-6 text-base text-gray-700">
                  {data?.product?.description}
                </p>
              </>
            )}
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button className="flex items-center justify-center rounded-full p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400">
                <svg
                  className="h-6 w-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="mb-3 h-56 w-full bg-slate-300" />
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="font-demidum text-sm text-gray-900">
                    {product.price} 원
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
