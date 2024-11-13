import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const result = useQuery({ queryKey: ["todos"], queryFn: () => ["3"] });
  return null;
}
