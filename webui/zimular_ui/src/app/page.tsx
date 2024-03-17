//const {app, server, wsk, conManager, mongo, EventHandler, sessionManager} = require('@/app/api/Tools/tools');

import Navigation from "@/components/main-nav";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <>
      {/* <Navigation />
      <center className="">Home</center> */}
      <Dashboard/>
    </>
  );
}

