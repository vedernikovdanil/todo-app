import React from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      // @ts-expect-error [mildly irritated message]
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
