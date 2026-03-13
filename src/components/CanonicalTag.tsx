import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://www.ilcortilemalpensa.com";

export default function CanonicalTag() {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = pathname === "/" ? `${BASE_URL}/` : `${BASE_URL}${pathname}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [pathname]);

  return null;
}
