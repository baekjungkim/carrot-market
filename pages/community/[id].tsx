import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
import { makeJoinClassname } from "@libs/client/utils";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUserAndCount extends Post {
  user: User;
  answers: AnswerWithUser[];
  _count: {
    answers: number;
    curiosities: number;
  };
}

interface PostDetailResponse {
  ok: boolean;
  post: PostWithUserAndCount;
  isCuriosity: boolean;
  error?: string;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  answer: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();

  const { data, error, mutate } = useSWR<PostDetailResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const isLoading = !data && !error;

  const [toggleCuriosity, { loading: curiosityLoading }] = useMutation(
    `/api/posts/${router.query.id}/curiosity`
  );

  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answer`);

  useEffect(() => {
    if (data && !data?.ok) {
      alert(data?.error);
    }
  }, [data]);

  const onCuriosityClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            curiosities: data?.isCuriosity
              ? data?.post._count.curiosities - 1
              : data?.post._count.curiosities + 1,
          },
        },
        isCuriosity: !data.isCuriosity,
      },
      false
    );
    if (!curiosityLoading) {
      toggleCuriosity({});
    }
  };

  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
    }
  }, [answerData, reset]);

  return (
    <Layout
      title={isLoading ? "Loading..." : `Q. ${data?.post?.question}`}
      hasTabBar
      isGoBack
    >
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>
        {isLoading ? (
          <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
            Loading...
          </div>
        ) : (
          <Link href={`/users/profiles/${data?.post?.user?.id}`}>
            <a className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
              <div className="h-10 w-10 rounded-full bg-slate-300" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {data?.post?.user?.name}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </p>
              </div>
            </a>
          </Link>
        )}
        <div>
          <div className="mt-2 px-4 text-gray-700">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <span className="font-medium text-orange-500">Q.</span>{" "}
                {data?.post?.question}
              </>
            )}
          </div>
          <div className="mt-3 flex w-full justify-start space-x-3 border-t border-b px-4 py-2.5 text-gray-700">
            <button
              onClick={onCuriosityClick}
              className={makeJoinClassname(
                "flex w-28 items-center space-x-2 text-sm",
                data?.isCuriosity ? "text-orange-500" : ""
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.post?._count?.curiosities}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.post?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="block text-xs text-gray-500 ">
                  {answer.createdAt}
                </span>
                <p className="mt-2 text-gray-700">{answer.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="px-4" onSubmit={handleSubmit(onValid)}>
          <TextArea
            register={register("answer", { required: true, minLength: 5 })}
            name="description"
            placeholder="Answer this question!"
            required
          />
          <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
            {answerLoading ? "Loading..." : "Reply"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
