export const makeJoinClassname = (...classnames: string[]) => {
  return classnames.join(" ");
};

export const serveImage = ({
  id,
  variant = "public",
}: {
  id: string;
  variant?: "public" | "avatar";
}) => {
  return `https://imagedelivery.net/-4c3-zEb4Op0_1qjNCTcBg/${id}/${variant}`;
};

const getUploadUrl = async () => {
  const { uploadURL } = await (await fetch("/api/files")).json();
  return uploadURL;
};

export const bulkUpload = async ({
  files,
  fileName,
}: {
  files: FileList;
  fileName?: string;
}) => {
  const ids: string[] = [];

  const uploads = Array.from(files).map(async (file, i) => {
    const uploadURL = await getUploadUrl();
    const form = new FormData();
    form.append("file", file, fileName && `${fileName}_${i}`);

    const {
      result: { id },
    } = await (await fetch(uploadURL, { method: "POST", body: form })).json();

    ids.push(id);
  });

  await Promise.all(uploads);

  return ids;
};
