"use client"

import { Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Analytics } from "@/lib/actions"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState, useEffect } from "react"


export const ChartComponent = async () => {

  interface typeAnalytics {
    queries: number,
    connection: number
  }
  const [analytics, setAnalytics] = useState<typeAnalytics>({queries: 0, connection: 0});

  useEffect(() => {
    const fetchData = async () => {
      const analyticsData = await Analytics();
      setAnalytics(analyticsData);
    };

    fetchData();
  }, []);
  const chartData = [
    { browser: "chrome", visitors: analytics.queries, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: analytics.connection, fill: "var(--color-firefox)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Connection",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Table",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Query",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig

  return (
    <Card className="shadow border grid col-span-3 h-full dark:bg-custom-gradient rounded-lg py-4 px-5 relative">
      <div className="items-center pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>Figure of Operations</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
      </div>
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
