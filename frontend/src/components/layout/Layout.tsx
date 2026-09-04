import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../styles/Layout.css";
import Iridescence from "../iridescence/Iridescence";
import { useState } from "react";
import AuthPanel from "../auth/AuthPanel";

function Layout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  function openAuthPanel() {
    setIsAuthOpen(true);
  }

  return (
    <div className="layout">
      <div className="layout-background">
        <Iridescence
          color={[0.0039, 0.0863, 0.2157]}
          mouseReact={false}
          amplitude={0.1}
          speed={1}
        />
      </div>

      <div className="layout-content">
        <Navbar onLoginClick={openAuthPanel} />

        <main>
          <Outlet context={{ openAuthPanel }} />
        </main>

        <Footer />
        <AuthPanel isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </div>
  );
}

export default Layout;
