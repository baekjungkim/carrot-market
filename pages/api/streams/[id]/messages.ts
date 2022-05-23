import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { message },
    query: { id },
    session: { user },
  } = req;

  const stream = await client.stream.findUnique({
    where: { id: +id.toString() },
  });

  if (!stream)
    return res.status(404).json({ ok: false, error: "Not found stream" });

  const newMessage = await client.message.create({
    data: {
      message,
      stream: {
        connect: {
          id: stream.id,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({
    ok: true,
    message: newMessage,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
