import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { Stream, User } from "@prisma/client";
import Button from "@components/button";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import { useEffect } from "react";

interface StreamWithUser extends Stream {
  user: User;
}

interface StreamsResponse {
  ok: boolean;
  streams: StreamWithUser[];
  pages: number;
}

const PAGE_SIZE = 10;
const getKey = (page: number, prevPageData: StreamsResponse) => {
  // if (page !== 0 && page + 1 > prevPageData.pages) return null;
  if (prevPageData && prevPageData.streams.length < PAGE_SIZE) return null; // reached the end
  return `/api/streams?page=${page}&take=${PAGE_SIZE}`; // SWR key
};

const Streams: NextPage = () => {
  const { data, setSize } = useSWRInfinite<StreamsResponse>(getKey, {
    revalidateFirstPage: false,
  });
  const page = useInfiniteScroll();
  useEffect(() => {
    setSize(page);
  }, [page, setSize]);

  return (
    <Layout title="라이브" hasTabBar>
      <div className="space-y-4 divide-y">
        {data?.map(({ streams }) => {
          return streams?.map((stream) => (
            <Link key={stream.id} href={`/streams/${stream.id}`}>
              <a className="block px-4  pt-4">
                <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />

                <div className="mt-2 flex justify-between space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {stream.id}
                  </h1>
                  <div className="flex space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-500" />
                    <span className="font-medium text-gray-900">
                      {stream?.user?.name}
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          ));
        })}

        {/* <div className="pt-10 pb-2">
          <Button onClick={() => setSize(size + 1)} text="Load More" />
        </div> */}

        <FloatingButton href="/streams/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
