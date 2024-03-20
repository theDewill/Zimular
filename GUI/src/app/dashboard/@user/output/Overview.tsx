import Areachrt from "@/components/charts/Areachart";
import Doughnutchart from "@/components/charts/Doughnutchart";
import Horizontalchart from "@/components/charts/Horizontalchart";
import LineBarAreachrt from "@/components/charts/LineBarAreachrt";
import Linechrt from "@/components/charts/Linechart";
import Piechart from "@/components/charts/Piechart";
import Verticalchart from "@/components/charts/Verticalchart";
import React from "react";

export default function Overview() {
    return (
        <div>
            {/* <Horizontalchart /> */}
            {/* <Verticalchart /> */}
            {/* <Areachrt /> */}
            {/* <Linechrt /> */}
            <LineBarAreachrt />
            {/* <Piechart /> */}
            {/* <Doughnutchart/> */}
        </div>
    )
}
