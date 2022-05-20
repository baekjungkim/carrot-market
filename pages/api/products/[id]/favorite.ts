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
  });

  if (!product)
    return res.status(404).json({ ok: false, message: "Not found product" });

  const alreadyExists = await client.record.findFirst({
    where: {
      productId: product.id,
      userId: user?.id,
      kind: "Favorite",
    },
    select: {
      id: true,
    },
  });

  if (alreadyExists) {
    await client.record.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.record.create({
      data: {
        kind: "Favorite",
        product: {
          connect: {
            id: product.id,
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
