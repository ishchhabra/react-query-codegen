import { useQuery } from "@tanstack/react-query";

function fetchData() {
  return "data";
}

export default function Page() {
  useQuery({ queryKey: ["todos"], queryFn: fetchData });

  return null;
}
