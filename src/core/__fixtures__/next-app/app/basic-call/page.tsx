import { useQuery } from "@tanstack/react-query";

export default function Page() {
  useQuery({ queryKey: ["todos"], queryFn: () => ["3"] });

  return null;
}
