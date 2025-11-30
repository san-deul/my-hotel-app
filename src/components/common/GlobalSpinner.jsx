import { useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { createPortal } from "react-dom";

export default function GlobalSpinner() {
  const isFetching = useIsFetching();

  // 스크롤 잠금
  useEffect(() => {
    if (isFetching > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFetching]);

  if (isFetching > 0) {
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <Spinner />
      </div>,
      document.body
    );
  }

  return null;
}
