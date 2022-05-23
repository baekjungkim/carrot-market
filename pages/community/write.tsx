import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [writePost, { loading, data }] =
    useMutation<WriteResponse>("/api/posts");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    writePost({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout title="질문 등록" isGoBack>
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
          disabled={loading}
        />
        <Button loading={loading} text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
