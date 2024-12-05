import { riders } from "@/constants/menu";
import { mongooseConnect } from "@/lib/mongoose";
import { generateNextId } from "@/lib/utils";
import Rider from "@/models/Rider";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    mongooseConnect();
    const {
      surName,
      firstName,
      middleName,
      sex,
      district,
      city,
      dateOfBirth,
      park,
      photo,
      userId,
      type,
    } = await request.json();
    const client = await clerkClient();
    const id = await generateNextId();
    const user = await client.users.getUser(userId);
    const newRider = new Rider({
      id,
      surName,
      firstName,
      middleName,
      sex,
      district,
      city,
      dateOfBirth,
      park,
      photo,
      userId,
      type,
    });
    await newRider.save();

    if (user.publicMetadata.role === "collector") {
      const riders = await Rider.find({ userId })
        .sort({ createdAt: -1 })
        .limit(100);
      return NextResponse.json({ message: "User created", riders });
    }
    const riders = await Rider.find().sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ message: "User created", riders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" });
  }
}
// export async function PUT(request: NextRequest) {
//   try {
//     const { id, firstName, lastName, email, role } = await request.json();
//     const client = await clerkClient();

//     await client.users.updateUser(id, {
//       firstName: firstName,
//       lastName: lastName,
//       publicMetadata: {
//         role: role,
//       },
//     });

//     const { data } = await (await clerkClient()).users.getUserList();
//     const users = data?.map((user) => ({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.emailAddresses[0].emailAddress,
//       photo: user.imageUrl,
//       role: user.publicMetadata.role,
//     }));

//     return NextResponse.json({ message: "User created", users });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error: "Error creating user" });
//   }
// }
// export async function PATCH(request: NextRequest) {
//   try {
//     const { id } = await request.json();
//     const client = await clerkClient();

//     await client.users.deleteUser(id);

//     const { data } = await (await clerkClient()).users.getUserList();
//     const users = data?.map((user) => ({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.emailAddresses[0].emailAddress,
//       photo: user.imageUrl,
//       role: user.publicMetadata.role,
//     }));

//     return NextResponse.json({ message: "User created", users });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error: "Error creating user" });
//   }
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "200");
  const search = searchParams.get("search") || "";
  // Determine the value of isPrinted
  const isPrintedParam = searchParams.get("isPrinted");

  const isPrinted =
    isPrintedParam === "true"
      ? true
      : isPrintedParam === "false"
      ? false
      : undefined;

  const skip = (page - 1) * limit;

  try {
    mongooseConnect();
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { surName: { $regex: search, $options: "i" } },
            { district: { $regex: search, $options: "i" } },
            { park: { $regex: search, $options: "i" } },
            { id: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const getquery: any = {};
    if (isPrinted !== undefined) {
      getquery.isPrinted = isPrinted;
    }
    const riders = await Rider.find(getquery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Rider.countDocuments(query);

    return NextResponse.json({
      riders,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    mongooseConnect();
    const {
      surName,
      id,
      firstName,
      middleName,
      sex,
      designation,
      district,
      city,
      dateOfBirth,
      park,
      photo,
      imageId,
      type,
    } = await request.json();

    const rider = await Rider.findOne({ id: id });

    const data = {
      surName,
      firstName,
      middleName,
      sex,
      district,
      city,
      dateOfBirth,
      park,
      designation,
      photo,
      imageId,
      type,
    };
    await Rider.findByIdAndUpdate(rider._id, data, {
      new: true,
    });
    if (photo !== rider.photo) {
      await cloudinary.uploader.destroy(rider.imageId);
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error updating rider" });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    mongooseConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    const rider = await Rider.findOne({ id: id });
    await Rider.findByIdAndDelete(rider._id);
    await cloudinary.uploader.destroy(rider.imageId);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error Deleteing user" });
  }
}
