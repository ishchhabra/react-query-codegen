import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const variable = "5";
  useQuery({ queryKey: ["todos"], queryFn: () => variable });

  return null;
}
