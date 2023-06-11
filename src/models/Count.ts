import {
  countRepository,
  CountRepository,
} from "@/repositories/CountRepository";

export type Count = {
  [key: number]: number | undefined;
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  7?: number;
};

export const countFactory = (rep?: CountRepository) => {
  const repository = rep ?? countRepository;
  return {
    get: async (id: string): Promise<Count> => {
      const count = await repository.countBodyParts(id);
      return count;
    },
  };
};
