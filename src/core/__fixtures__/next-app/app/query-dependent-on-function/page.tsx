import { useQuery } from "@tanstack/react-query";

function fetchData() {
  return "data";
}

export default function Page() {
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: fetchData,
  });
}
