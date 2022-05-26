import { PrismaClient } from "@prisma/client";
import { clearTimeout } from "timers";

const client = new PrismaClient();

const main = async () => {
  // [...Array.from(Array(500).keys())].forEach(async (item) => {
  //   await client.stream.create({
  //     data: {
  //       name: String(item),
  //       description: String(item),
  //       price: item,
  //       user: {
  //         connect: {
  //           id: 11,
  //         },
  //       },
  //     },
  //   });
  // });
};

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
