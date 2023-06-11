import { ApiClient } from "@/lib/api-client";
import { Count } from "@/models/Count";

export type CountRepository = {
  countBodyParts: (id: string) => Promise<Count>;
};

const countBodyParts: CountRepository["countBodyParts"] = async (id) => {
  const response = await ApiClient.get(`/count/${id}`);
  return response.data.typeCounts;
};

export const countRepository: CountRepository = {
  countBodyParts,
};
