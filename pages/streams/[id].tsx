import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Message as TMessage, Stream, User } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";

interface StreamMessage {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}

interface StreamWithMessage extends Stream {
  user: User;
  messages: StreamMessage[];
}

interface StreamDetailResponse {
  ok: boolean;
  stream: StreamWithMessage;
  error?: string;
}

interface MessageForm {
  message: string;
}

interface SendMessageResponse {
  ok: boolean;
  message: TMessage;
  error?: string;
}

const StreamDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, error, mutate } = useSWR<StreamDetailResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      // refreshInterval: 1000, // fake realtime
    }
  );
  const isLoading = !data && !error;

  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data: sendMessageData, loading }] =
    useMutation<SendMessageResponse>(
      `/api/streams/${router.query.id}/messages`
    );

  useEffect(() => {
    if (data && !data.ok) {
      alert(data.error);
      router.replace("/streams");
    }
  }, [data, router]);

  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  id: user?.id,
                  avatar: user?.avatar,
                },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  return (
    <Layout title={data?.stream?.name} isGoBack>
      <div className="space-y-4 py-10  px-4">
        {data?.stream?.cloudflareId ? (
          <iframe
            className="aspect-video w-full rounded-md shadow-sm"
            src={`https://iframe.videodelivery.net/${data?.stream?.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            id="stream-player"
          ></iframe>
        ) : null}
        <div className="mt-5">
          <div className="mt-2 flex justify-between space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.stream?.name}
            </h1>
            <div className="flex space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-500" />
              <span className="font-medium text-gray-900">
                {data?.stream?.user?.name}
              </span>
            </div>
          </div>
          <span className="mt-3 block text-2xl text-gray-900">
            {data?.stream?.price} ???
          </span>
          <p className="my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="flex flex-col space-y-3 overflow-scroll rounded-md bg-orange-400 p-5">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-800">URL: </span>
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-800">Key: </span>
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
            {data?.stream?.messages?.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
          </div>
          <div className="fixed inset-x-0 bottom-0  bg-white py-2">
            <form
              className="relative mx-auto flex w-full  max-w-md items-center"
              onSubmit={handleSubmit(onValid)}
            >
              <input
                {...register("message", { required: true })}
                type="text"
                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
