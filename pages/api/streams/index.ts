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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        userId: true,
        cloudflareId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            avatar: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const streamLifeCycle = async (cloudflareId: string) => {
      const { live } = await (
        await fetch(`https://videodelivery.net/${cloudflareId}/lifecycle`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
          },
        })
      ).json();

      return live;
    };

    let streamsWithLifeCycle = [];
    for (const stream of streams) {
      const isLive = await streamLifeCycle(stream.cloudflareId);
      streamsWithLifeCycle.push({ ...stream, isLive });
    }

    res.json({
      ok: true,
      streams: streamsWithLifeCycle,
      pages: Math.ceil(streamsCount / +take),
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    const {
      result: {
        uid,
        rtmps: { url, streamKey },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10 }}`,
        }
      )
    ).json();

    const stream = await client.stream.create({
      data: {
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
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
