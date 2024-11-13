import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const variable = "5";
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => variable,
  });

  return null;
}
