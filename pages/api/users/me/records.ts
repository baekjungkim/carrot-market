import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind },
  } = req;

  const records = await client.record.findMany({
    where: {
      userId: user?.id,
      kind:
        kind === "favorites"
          ? "Favorite"
          : kind === "sales"
          ? "Sale"
          : "Purchase",
    },
    select: {
      id: true,
      product: {
        include: {
          records: {
            select: {
              id: true,
            },
            where: {
              kind: "Favorite",
            },
          },
        },
      },
    },
  });

  res.json({
    ok: true,
    records,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
