import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";

interface StreamResponse {
  ok: boolean;
  stream: Stream;
}

interface StreamForm {
  name: string;
  price: string;
  description?: string;
}

const Create: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StreamForm>();
  const [createStream, { data, error, loading }] =
    useMutation<StreamResponse>("/api/streams");
  const onValid = (form: StreamForm) => {
    if (loading) return;
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout title="라이브 생성" isGoBack>
      <form className=" space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
        <Input
          register={register("name", {
            required: "Name is Required",
          })}
          required
          label="Name"
          name="name"
          type="text"
        />
        {errors.name ? (
          <span className="my-2 block font-medium text-red-500">
            {errors.name.message}
          </span>
        ) : null}
        <Input
          register={register("price", {
            required: "Price is Required",
            valueAsNumber: true,
          })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        {errors.price ? (
          <span className="my-2 block font-medium text-red-500">
            {errors.price.message}
          </span>
        ) : null}
        <TextArea
          register={register("description")}
          name="description"
          label="Description"
        />
        <Button loading={loading} text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
