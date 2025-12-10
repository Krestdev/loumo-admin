import { useQuery } from "@tanstack/react-query";

//Fetch Data
export const FetchAll = <T>(
  queryFn: () => Promise<T[]>,
  key: string,
  refetchInterval: number | false = false
) =>
  useQuery({
    queryKey: [key],
    queryFn,
    refetchOnWindowFocus: false,
    retryDelay: 60000,
    refetchInterval,
  });
