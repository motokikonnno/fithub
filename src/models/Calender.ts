import {
  calenderRepository,
  CalenderRepository,
} from "@/repositories/CalenderRepository";

export type Calender = {
  date: string;
  count: number;
  commitNumber: number;
};

export const calenderFactory = (rep?: CalenderRepository) => {
  const repository = rep ?? calenderRepository;
  return {
    index: async (user_id: string): Promise<Calender[]> => {
      const calender = await repository.getCalender(user_id);
      return calender;
    },
  };
};
