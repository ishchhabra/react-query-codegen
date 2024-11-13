import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const [variable, setVariable] = useState(0);
  useQuery({ queryKey: ["todos"], queryFn: () => variable });

  return null;
}
