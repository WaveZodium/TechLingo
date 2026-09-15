import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scrollar till toppen vid ny navigering, men bevarar scrollposition vid back/forward
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP" || hash) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}

export default ScrollToTop;
