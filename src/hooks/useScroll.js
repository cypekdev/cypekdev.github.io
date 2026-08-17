import { useContext } from "react";
import { ScrollContext } from "../providers/ScrollProvider";


export default function useScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error(
      "useScroll must be used inside ScrollProvider"
    );
  }

  return context;
}