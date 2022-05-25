import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { makeJoinClassname, serveImage } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isFavorite: boolean;
}

const ItemDetail: NextPage = () => {
  // const { user, isLoading } = useUser();
  const router = useRouter();
  // const { mutate } = useSWRConfig();
  const {
    data,
    error,
    mutate: itemDetailMutate,
  } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const isDataLoading = !data && !error;
  const [toggleFavorite, { loading: favoriteLoading }] = useMutation(
    `/api/products/${router.query.id}/favorite`
  );

  const onFavoriteClick = () => {
    if (!data) return;
    itemDetailMutate(
      (prev) => prev && { ...prev, isFavorite: !prev.isFavorite },
      false
    );
    if (!favoriteLoading) {
      toggleFavorite({});
    }
    // mutatee("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
  };

  return (
    <Layout
      title={isDataLoading ? "Loading..." : data?.product?.name}
      hasTabBar
      isGoBack
    >
      <div className="px-4 py-4">
        <div className="mb-5">
          {/* {data?.product?.image ? ( */}
          <div className="relative pb-80">
            <Image
              src={serveImage({ id: data?.product?.image! })}
              className="object-left"
              layout="fill"
              placeholder="blur"
              blurDataURL="https://i.ibb.co/ByhpsFY/blur.png"
              alt={`${data?.product?.name} image`}
            />
          </div>
          {/* ) : (
            <div
              className={`h-96 bg-slate-300 ${
                isDataLoading ? "animate-pulse" : ""
              }`}
            />
          )} */}
          <Link href={`/users/profiles/${data?.product?.user?.id}`}>
            <a className="flex items-center space-x-3 border-b py-3">
              {data?.product?.user?.avatar ? (
                <Image
                  width={48}
                  height={48}
                  src={serveImage({
                    id: data?.product?.user?.avatar,
                    variant: "avatar",
                  })}
                  placeholder="blur"
                  blurDataURL="https://i.ibb.co/ByhpsFY/blur.png"
                  className="h-12 w-12 cursor-pointer rounded-full object-fill"
                  alt={`${data?.product?.user?.name} avatar`}
                />
              ) : (
                <div className="h-12 w-12 cursor-pointer rounded-full bg-slate-300" />
              )}
              <div className="cursor-pointer ">
                <p className="font-demidum text-sm text-gray-700">
                  {data?.product?.user?.name}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </p>
              </div>
            </a>
          </Link>
          <div className="mt-5">
            {isDataLoading ? (
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
              <button
                onClick={onFavoriteClick}
                className={makeJoinClassname(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
                  data?.isFavorite
                    ? "text-red-500  hover:text-red-500"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isFavorite ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
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
                )}
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
