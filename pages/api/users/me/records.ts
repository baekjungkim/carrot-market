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
      productId: true,
    },
  });

  let products;
  if (records.length > 0) {
    const productIdArr = records?.map((record) => record.productId);
    products = await client.product.findMany({
      where: {
        id: {
          in: productIdArr,
        },
      },
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

    // products = await client.$queryRaw`
    //   SELECT Product.*,
    //         (
    //           SELECT COUNT(*)
    //             FROM Record
    //            WHERE Record.productId = Product.id
    //              AND kind = 'Favorite'
    //         ) as favorites
    //     FROM Product
    //    WHERE id IN (${productIdArr.join()})
    // `;
  }

  res.json({
    ok: true,
    products,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
