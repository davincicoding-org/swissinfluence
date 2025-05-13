import { useGetIdentity } from "react-admin";

export const useAdminAccess = () => {
  const { data } = useGetIdentity();
  return data?.id === "AGOYyIgaboaxrpMLh8vnOsqKH712";
};
