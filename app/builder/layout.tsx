import { Suspense } from "react";

export default function Builderayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
     <Suspense>
      {children}
     </Suspense>
    );
  }