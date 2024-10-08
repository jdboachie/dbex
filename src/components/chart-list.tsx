"use client"

import { Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Analytics } from "@/lib/actions"
import EmptyState from '@/components/closet/empty-state'
import { ZeroConfigIcon } from '@/components/icons'

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


export const ChartComponent = async ({className}:{className?:string}) => {

  interface typeAnalytics {
    queries: number,
    connection: number
  }
  const [analytics, setAnalytics] = useState<typeAnalytics>({ queries: 0, connection: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const analyticsData = await Analytics();
      setAnalytics(analyticsData);
    };

    fetchData();
  }, []);
  const chartData = [
    { browser: "chrome", visitors: analytics.queries, fill: "var(--color-chrome)" },
    { browser: "firefox", visitors: analytics.connection, fill: "var(--color-firefox)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Analytics",
    },
    chrome: {
      label: "Connection",
      color: "hsl(var(--chart-1))",
    },
    firefox: {
      label: "Query",
      color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig

  return (
    <Card className={`${className} shadow border grid h-full dark:bg-custom-gradient rounded-lg py-4 px-5 relative`}>
      <div className="items-center pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>Figure of Operations</CardTitle>
          <CardDescription className="text-center">Connections and Queries</CardDescription>
        </CardHeader>
      </div>
      <div className="flex-1 pb-0">

        <ChartContainer
          config={chartConfig}
          className={`mx-auto aspect-square max-h-[250px] ${analytics.queries === 0 && analytics.connection === 0 ? 'hidden' : ''}`}

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
        <div className={`flex flex-col justify-center items-center ${analytics.connection === 0 && analytics.queries === 0? '': 'hidden'}`}>
          <EmptyState
            small
            icon={ZeroConfigIcon}
            title='0 connections Found'
            description="Click on the Connect to Database"
          />
        </div>
      </div>
    </Card>
  )
}
