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

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!product)
    return res.status(404).json({ ok: false, message: "Not found product" });

  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isFavorite = Boolean(
    await client.record.findFirst({
      where: {
        userId: user?.id,
        productId: product?.id,
        kind: "Favorite",
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    product,
    relatedProducts,
    isFavorite,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
