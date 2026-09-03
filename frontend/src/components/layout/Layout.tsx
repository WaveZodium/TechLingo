import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../styles/Layout.css";
import Iridescence from "../iridescence/Iridescence";

function Layout() {
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
        <Navbar />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
