import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose"; // Adjust the import path as needed
import Rider from "@/models/Rider"; // Adjust the import path as needed
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  await mongooseConnect();

  try {
    const totalRiders = await Rider.countDocuments();
    const printedCards = await Rider.countDocuments({ isPrinted: true });
    const { data } = await (await clerkClient()).users.getUserList();
    const pendingPrinting = 500000 - printedCards; // Assuming 500,000 is the total target
    const ridersByDistrict = await Rider.aggregate([
      { $group: { _id: "$district", count: { $sum: 1 } } },
      { $project: { name: "$_id", bikeRiders: "$count" } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const ageRangeDistribution = await Rider.aggregate([
      {
        $addFields: {
          age: {
            $divide: [
              { $subtract: [new Date(), "$dateOfBirth"] },
              365 * 24 * 60 * 60 * 1000, // Convert milliseconds to years
            ],
          },
        },
      },
      {
        $project: {
          ageGroup: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 25] }],
                  },
                  then: "18-25",
                },
                {
                  case: {
                    $and: [{ $gte: ["$age", 26] }, { $lte: ["$age", 35] }],
                  },
                  then: "26-35",
                },
                {
                  case: {
                    $and: [{ $gte: ["$age", 36] }, { $lte: ["$age", 45] }],
                  },
                  then: "36-45",
                },
              ],
              default: "46+",
            },
          },
        },
      },
      {
        $group: {
          _id: "$ageGroup",
          count: { $sum: 1 },
        },
      },
      { $project: { name: "$_id", value: "$count" } },
      {
        $sort: { _id: 1 },
      },
    ]);

    return NextResponse.json({
      totalRiders,
      printedCards,
      pendingPrinting,
      totalUsers: data.length,
      ridersByDistrict,
      ageRangeDistribution,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
