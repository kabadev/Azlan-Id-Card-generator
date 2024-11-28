"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const districtData = [
  { name: "Freetown", bikeRiders: 0 },
  { name: "Bo", bikeRiders: 0 },
  { name: "Kenema", bikeRiders: 0 },
  { name: "Makeni", bikeRiders: 0 },
  { name: "Koidu", bikeRiders: 0 },
];

const ageRangeData = [
  { name: "18-25", value: 0 },
  { name: "26-35", value: 0 },
  { name: "36-45", value: 0 },
  { name: "46+", value: 0 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [dasboardData, setDasboardData] = useState<any>({});

  const fetchDasboardData = async () => {
    try {
      const res = await axios.get("/api/dashboard");
      setDasboardData(res.data);
    } catch (error) {
      console.log("console");
    }
  };

  useEffect(() => {
    fetchDasboardData();
  }, []);

  return (
    <div className="p-8 pb-10 h-[calc(100vh-70px)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total ID Cards Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {dasboardData ? dasboardData.totalRiders : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ID Cards Printed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dasboardData ? dasboardData.printedCards : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Printing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dasboardData ? dasboardData.pendingPrinting : "500,000"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {dasboardData ? dasboardData.totalUsers : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Bike Riders per District</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dasboardData?.ridersByDistrict}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bikeRiders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age Range Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dasboardData?.ageRangeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dasboardData?.ageRangeDistribution?.map(
                    (entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
