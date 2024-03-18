

import Navigation from "@/components/main-nav";
import Dashboard from "./dashboard/page";
import { GetServerSideProps } from "next";



export default function Home() {
  return (
    <>
      {/* <Navigation />
      <center className="">Home</center> */}
      <Dashboard/>
    </>
  );
}

