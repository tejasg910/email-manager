"use client"

import { useDashboard } from "../api/get-dasbhoard"
import Cards from "./Cards"
import Chart from "./Chart"



export default function Dashboard() {


    const { data } = useDashboard()

    console.log(data, "thisi data")
    return (
        <div className="space-y-6 w-full ">

            <div>
                <Cards sentPercentageChange={data.sentPercentageChange} totalPending={data.totalPending} totalSent={data.totalSent} />
            </div>
            <div>
                <Chart data={data.weeklyActivity} />
            </div>

        </div>
    )
}

