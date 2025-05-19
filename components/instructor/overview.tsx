"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    average: 65,
    highest: 80,
  },
  {
    name: "Feb",
    average: 68,
    highest: 85,
  },
  {
    name: "Mar",
    average: 70,
    highest: 88,
  },
  {
    name: "Apr",
    average: 72,
    highest: 90,
  },
  {
    name: "May",
    average: 75,
    highest: 92,
  },
  {
    name: "Jun",
    average: 78,
    highest: 95,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="average" name="Average Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="highest" name="Highest Score" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
