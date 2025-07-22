import { useSearchParams } from "next/navigation";

export const useFlag = (flag: string) => {
  const searchParams = useSearchParams();
  return searchParams.get(flag) !== null;
};
