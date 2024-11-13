import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const result1 = useQuery({
    queryKey: ["todos"],
    queryFn: () => "result1",
  });

  const result2 = useQuery({
    queryKey: ["todos"],
    queryFn: () => result1.data + "result2",
  });

  return null;
}
