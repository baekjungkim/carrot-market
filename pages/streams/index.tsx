import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { Stream, User } from "@prisma/client";
import Button from "@components/button";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";

interface StreamWithUser extends Stream {
  user: User;
  isLive: boolean;
}

interface StreamsResponse {
  ok: boolean;
  streams: StreamWithUser[];
  pages: number;
}
interface StreamsArray extends Stream {
  isLive: boolean;
}

const PAGE_SIZE = 10;
const getKey = (page: number, prevPageData: StreamsResponse) => {
  // if (page !== 0 && page + 1 > prevPageData.pages) return null;
  if (prevPageData && prevPageData.streams.length < PAGE_SIZE) return null; // reached the end
  return `/api/streams?page=${page}&take=${PAGE_SIZE}`; // SWR key
};

const Streams: NextPage = () => {
  const [streams, setStreams] = useState<StreamsArray | []>([]);
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
          return streams?.map((stream) => {
            return (
              <Link key={stream.id} href={`/streams/${stream.id}`}>
                <a className="block px-4  pt-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md shadow-sm">
                    <Image
                      layout="fill"
                      src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                      alt=""
                    />
                  </div>
                  <div className="mt-2 flex justify-between space-x-3">
                    <h1 className="flex items-center gap-x-2 text-2xl font-bold text-gray-900">
                      {stream.id}{" "}
                      {stream.isLive ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                          />
                        </svg>
                      )}
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
            );
          });
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
