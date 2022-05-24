import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { classicNameResolver } from "typescript";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page = 0, take = 10 },
    } = req;

    const streamsCount = await client.stream.count();
    const streams = await client.stream.findMany({
      take: +take,
      skip: +page * +take,
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
        // createdAt: "desc",
      },
    });
    res.json({ ok: true, streams, pages: Math.ceil(streamsCount / +take) });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
