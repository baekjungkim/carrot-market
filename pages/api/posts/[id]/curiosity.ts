import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    },
  });

  if (!post)
    return res.status(404).json({ ok: false, message: "Not found post" });

  const alreadyExists = await client.curiosity.findFirst({
    where: {
      postId: post.id,
      userId: user?.id,
    },
    select: {
      id: true,
    },
  });

  if (alreadyExists) {
    await client.curiosity.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.curiosity.create({
      data: {
        post: {
          connect: {
            id: post.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
