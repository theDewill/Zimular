import Card from "@/components/card";
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
            {/* <Doughnutchart/> */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Card title="Overview" description="This is the overview page" />
                </div>
            </div>
        </div>
    )
}
