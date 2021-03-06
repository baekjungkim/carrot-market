import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { userInfo } from "os";
import streams from "pages/api/streams";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const stream = await client.stream.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!stream)
    return res.status(404).json({ ok: false, error: "Not found Stream" });

  const isOwner = stream.userId === user?.id;
  if (!isOwner) {
    stream.cloudflareKey = "";
    stream.cloudflareUrl = "";
  }

  res.json({ ok: true, stream });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
