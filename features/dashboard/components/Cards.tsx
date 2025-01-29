import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Clock } from "lucide-react"
const Cards = ({ sentPercentageChange, totalPending, totalSent }: {
    sentPercentageChange
    :
    string
    totalPending
    :
    number
    totalSent
    : number
}) => {
    return (
        <div className="grid gap-6 md:grid-cols-2  space-x-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium ">Sent Emails</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl  font-bold">{totalSent}</div>
                    <p className={`text-xs ${sentPercentageChange.includes("+") ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
  {sentPercentageChange} from last week
</p>                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Emails</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPending}</div>

                </CardContent>
            </Card>
        </div>
    )
}

export default Cards