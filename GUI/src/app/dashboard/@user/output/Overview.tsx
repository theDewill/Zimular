<<<<<<< HEAD
import Card from "@/components/card";
import Areachart from "@/components/charts/Areachart";
=======
import Areachrt from "@/components/charts/Areachart";
>>>>>>> d7b799ca3ff3710e38a6d99e76178c37655565b4
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
<<<<<<< HEAD
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Card title="Overview" description="This is the overview page" />
                </div>
            </div>
=======
>>>>>>> d7b799ca3ff3710e38a6d99e76178c37655565b4
        </div>
    )
}
