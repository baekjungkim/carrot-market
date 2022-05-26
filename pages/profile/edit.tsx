import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import Router, { useRouter } from "next/router";
import { bulkUpload, makeJoinClassname, serveImage } from "@libs/client/utils";

interface EditProfileForm {
  avatar?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>({});

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.avatar)
      setAvatarPreview(serveImage({ id: user?.avatar, variant: "avatar" }));
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>("/api/users/me");

  const onValid = async ({ name, email, phone, avatar }: EditProfileForm) => {
    if (loading) return;
    let avatarId;
    if (avatar && avatar.length > 0) {
      const ids = await bulkUpload({ files: avatar });
      avatarId = ids[0];
    }
    console.log(avatarId);
    editProfile({
      name,
      email,
      phone: phone + "",
      avatarId,
    });
  };

  useEffect(() => {
    if (data && !data.ok) {
      return setError("formErrors", {
        message: data.error,
      });
    } else if (data && data.ok) {
      router.reload();
    }
  }, [data, setError, router]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const avatarFile = avatar[0];
      setAvatarPreview(URL.createObjectURL(avatarFile));
    }
  }, [avatar]);

  return (
    <Layout title="프로필 수정" isGoBack>
      <form className="space-y-4 py-3 px-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img src={avatarPreview} className="h-14 w-14 rounded-full" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500" />
          )}

          <label
            htmlFor="avatar"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="avatar"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", {
            required: {
              value: true,
              message: "Username is Required",
            },
          })}
          label="Username"
          name="name"
          type="text"
        />
        {errors.name ? (
          <span className="my-2 block font-medium text-red-500">
            {errors.name.message}
          </span>
        ) : null}
        <Input
          register={register("email", {
            validate: {
              chooseOne: (v) => {
                if (v !== "" || getValues().phone !== "") {
                  clearErrors(["email", "phone", "formErrors"]);
                  return true;
                } else {
                  return "Email OR Phone numebr are required. You need to choose one.";
                }
              },
            },
          })}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone", {
            validate: {
              chooseOne: (v) => {
                if (v !== "" || getValues().email !== "") {
                  clearErrors(["email", "phone", "formErrors"]);
                  return true;
                } else {
                  return "Email OR Phone numebr are required. You need to choose one.";
                }
              },
            },
          })}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.email ? (
          <span className="my-2 block font-medium text-red-500">
            {errors.email.message}
          </span>
        ) : null}
        {errors.formErrors ? (
          <span className="my-2 block text-center font-medium text-red-500">
            {errors.formErrors.message}
          </span>
        ) : null}

        <Button loading={loading} text={"Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
