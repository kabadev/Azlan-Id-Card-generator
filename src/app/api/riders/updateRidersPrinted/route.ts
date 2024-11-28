import { mongooseConnect } from "@/lib/mongoose";
import Rider from "@/models/Rider";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    mongooseConnect();
    const { riderIds } = await req.json();
    console.log(riderIds);
    if (!Array.isArray(riderIds) || riderIds.length === 0) {
      return NextResponse.json({ error: "Invalid rider IDs" }, { status: 400 });
    }

    const result = await Rider.updateMany(
      { _id: { $in: riderIds } },
      { $set: { isPrinted: true } }
    );

    return NextResponse.json({
      message: "Selected riders updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating riders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
