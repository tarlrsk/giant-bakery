import { Prisma } from "@prisma/client";

export type PersistenceCakeType = Prisma.CakeGetPayload<{
  include: {
    pounds: true;
    bases: true;
    fillings: true;
    topEdges: true;
    bottomEdges: true;
    decorations: true;
    surfaces: true;
  };
}>;
