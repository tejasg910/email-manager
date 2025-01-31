import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// Mock data for the chart
const chartData = [
    { day: "Mon", emails: 145 },
    { day: "Tue", emails: 231 },
    { day: "Wed", emails: 325 },
    { day: "Thu", emails: 256 },
    { day: "Fri", emails: 212 },
    { day: "Sat", emails: 186 },
    { day: "Sun", emails: 92 },
]
const Chart = ({data}: { data:{day: string, emails: number}[] }) => {
    return (

        <Card className="">
            <CardHeader>
                <CardTitle>Weekly Email Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        emails: {
                            label: "Sent Emails",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="emails" stroke="var(--color-emails)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default Chart