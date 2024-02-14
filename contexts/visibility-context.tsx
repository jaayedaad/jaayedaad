"use client";

import { createContext, useContext, useState } from "react";

export const VisibilityContext = createContext<
  | {
      visible: boolean;
      setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export default function VisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <VisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
}
