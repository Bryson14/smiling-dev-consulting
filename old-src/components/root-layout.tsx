import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function RootLayout() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <Outlet />
      <ScrollRestoration />
      <Footer />
    </div>
  );
}
