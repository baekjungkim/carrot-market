import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
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
    });

    // const products = await client.$queryRaw`
    //   SELECT Product.*,
    //         (
    //           SELECT COUNT(*)
    //             FROM Record
    //            WHERE Record.productId = Product.id
    //              AND kind = 'Favorite'
    //         ) as favorites
    //     FROM Product
    // `;

    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, image },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
