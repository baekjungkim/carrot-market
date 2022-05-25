import { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { bulkUpload } from "@libs/client/utils";

interface UploadProductForm {
  image: FileList | "";
  name: string;
  price: number;
  description: string;
}

interface MutationResult {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadProductForm>();
  const [uploadProducts, { loading, data }] =
    useMutation<MutationResult>("/api/products");
  const onValid = async (data: UploadProductForm) => {
    if (loading) return;
    const ids = await bulkUpload({
      files: data.image as FileList,
      fileName: "product",
    });
    uploadProducts({ ...data, image: ids[0] });
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  const [imagePreview, setImagePreview] = useState("");
  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const imageFile = image[0];
      setImagePreview(URL.createObjectURL(imageFile));
    }
  }, [image]);

  console.log(errors);

  return (
    <Layout title="상품 등록" isGoBack>
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {imagePreview ? (
            <label className="flex flex-col items-end">
              <img
                src={imagePreview}
                className="h-48 w-full cursor-pointer rounded-md border-2 border-gray-300"
              />
              <input
                {...register("image", {
                  required: "Image is Required",
                })}
                className="hidden"
                type="file"
                accept="image/*"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setImagePreview("");
                  setValue("image", "");
                }}
                className="mt-2 rounded-md border border-transparent bg-gray-500 px-4 font-medium text-white shadow-sm hover:bg-gray-500  focus:bg-gray-500 focus:outline-none focus:ring-2  focus:ring-offset-2"
              >
                Clear
              </button>
            </label>
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("image", {
                  required: "Image is Required",
                })}
                className="hidden"
                type="file"
              />
            </label>
          )}
          {errors.image ? (
            <span className="my-2 block font-medium text-red-500">
              {errors.image.message}
            </span>
          ) : null}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button loading={loading} text="Upload item" />
      </form>
    </Layout>
  );
};

export default Upload;
