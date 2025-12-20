"use client";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { ActivityGroup } from "@/lib/db";
import { CustomPieTooltip } from "./custom-tooltip";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ActivityTypesProps {
  entries: ActivityGroup[];
  totalActivities: number;
}

export const ActivityTypes = ({
  entries,
  totalActivities,
}: ActivityTypesProps) => {
  const { theme } = useTheme();
  const [mainColor, setMainColor] = useState("#42b983");

  useEffect(() => {
    setMainColor(theme === "dark" ? "#22c55e" : "#42b983");
  }, [theme]);

  const data = [
    {
      name: "PR Opened",
      value: entries[0]?.activities.length,
      color: mainColor,
    },
    {
      name: "PR Merged",
      value: entries[1]?.activities.length,
      color: "#8957e5",
    },
    {
      name: "Issues",
      value: entries[2]?.activities.length,
      color: "#52525b",
    },
  ];

  const calcPercentage = (items: number, totalItems: number) => {
    const res = (items / totalItems) * 100;
    return res.toFixed(1);
  };

  return (
    <Card className="flex flex-col rounded-[20px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-linear-to-b dark:from-zinc-900 dark:via-zinc-900 dark:to-black shadow-xl shadow-[#edfff7] dark:shadow-black/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
        <CardTitle className="text-xs uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-400">
          Distribution
        </CardTitle>
        <PieChartIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-between gap-4 p-6 pt-2">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ zIndex: 50 }}
                content={<CustomPieTooltip />}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl text-center font-bold text-zinc-900 dark:text-white leading-none">
              Total <br /> activities
            </span>
          </div>
        </div>

        <div className="w-full space-y-3 text-sm mt-auto">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                {item.name}
              </span>
              <span className="ml-auto text-zinc-500 font-semibold">
                {calcPercentage(item.value ?? 0, totalActivities)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};