"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CustomPieTooltip } from "./custom-tooltip";

interface DataPoint {
  week: string;
  value: number;
  isPeak?: boolean;
}

interface ActivityLineCardProps {
  totalActivitiesLabel: number;
  prev_month: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

export function ActivityLineCard({
  totalActivitiesLabel,
  prev_month,
  week1,
  week2,
  week3,
  week4,
}: ActivityLineCardProps) {
  const { theme } = useTheme();
  const [lineColor, setLineColor] = useState("#42b983");
  const [axisColor, setAxisColor] = useState("#71717a");

  const formattedTotal = new Intl.NumberFormat(
    "en-US"
  ).format(totalActivitiesLabel);

  const maxValue = Math.max(week1, week2, week3, week4);

  const chartData: DataPoint[] = [
    {
      week: "1st",
      value: week1,
      isPeak: week1 === maxValue,
    },
    {
      week: "2nd",
      value: week2,
      isPeak: week2 === maxValue,
    },
    {
      week: "3rd",
      value: week3,
      isPeak: week3 === maxValue,
    },
    {
      week: "4th",
      value: week4,
      isPeak: week4 === maxValue,
    },
  ];

  const wowChange =
    week3 > 0 ? ((totalActivitiesLabel - prev_month) / prev_month) * 100 : 0;

  const isUp = wowChange > 0;
  const isDown = wowChange < 0;

  useEffect(() => {
    if (theme === "dark") {
      setLineColor("#22c55e");
      setAxisColor("#a1a1aa");
    } else {
      setLineColor("#42b983");
      setAxisColor("#71717a");
    }
  }, [theme]);

  const CustomPeakLabel = (props: any) => {
    const { x, y, index, color } = props;
    if (!chartData[index]?.isPeak) return null;

    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          x={-20}
          y={-35}
          width={40}
          height={24}
          rx={4}
          fill={color}
        />
        <polygon
          points="0,0 -6,-8 6,-8"
          fill={color}
          transform="translate(0, -5)"
        />
        <text
          x={0}
          y={-20}
          textAnchor="middle"
          fill="black"
          fontSize={12}
          fontWeight="bold"
        >
          High
        </text>
        <circle
          cx={0}
          cy={0}
          r={4}
          fill="white"
          stroke={color}
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <Card className="relative w-full overflow-hidden rounded-[20px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-linear-to-b dark:from-zinc-900 dark:via-zinc-900 dark:to-black p-6 shadow-xl shadow-[#edfff7] dark:shadow-black/50">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgb(16,185,129)]"
              style={{ backgroundColor: lineColor }}
            ></span>
            <p className="text-xs uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-400">
              Total Activities
            </p>
          </div>
          <h2 className="mt-2 text-5xl font-bold text-[#42b983] dark:text-white tracking-tight">
            {formattedTotal}
          </h2>
          <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Activity up significantly from last month
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <MoreHorizontal className="text-zinc-400 dark:text-zinc-600 h-5 w-5" />
          <span
            className={`
    inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold
    ${
      isUp
        ? "bg-emerald-500/20 text-emerald-400"
        : isDown
        ? "bg-rose-500/20 text-rose-400"
        : "bg-zinc-500/20 text-zinc-400"
    }
  `}
          >
            {isUp && (
              <ArrowUpRight className="size-4 mr-1" />
            )}
            {isDown && (
              <ArrowDownRight className="size-4 mr-1" />
            )}
            {Math.abs(wowChange).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={chartData}
            margin={{
              top: 55,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={lineColor}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={lineColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: axisColor,
                fontSize: 12,
                fontWeight: 500,
              }}
              dy={10}
            />

            <Tooltip
              wrapperStyle={{ zIndex: 50 }}
              content={<CustomPieTooltip />}
            />

            <Area
              type="natural"
              dataKey="value"
              fill="url(#chartGradient)"
              stroke="none"
            />

            <Line
              type="natural"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
            >
              <LabelList
                content={
                  <CustomPeakLabel color={lineColor} />
                }
                dataKey="value"
                position="top"
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
