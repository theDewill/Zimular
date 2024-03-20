import Areachart from "@/components/charts/Areachart";
import Doughnutchart from "@/components/charts/Doughnutchart";
import Horizontalchart from "@/components/charts/Horizontalchart";
import Linechart from "@/components/charts/Linechart";
import Multiaxislinechart from "@/components/charts/Multiaxislinechart";
import Piechart from "@/components/charts/Piechart";
import Verticalchart from "@/components/charts/Verticalchart";
import React from "react";

export default function Overview() {
    return (
        <div>
            {/* <Horizontalchart /> */}
            {/* <Verticalchart /> */}
            {/* <Areachart /> */}
            {/* <Linechart /> */}
            {/* <Multiaxislinechart /> */}
            {/* <Piechart /> */}
            <Doughnutchart/>
        </div>
    )
}
