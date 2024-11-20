import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [variable, setVariable] = useState(0);
  useQuery({ queryKey: ["todos"], queryFn: () => variable });

  return null;
}
