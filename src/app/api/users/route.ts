import { mongooseConnect } from "@/lib/mongoose";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // mongooseConnect();
    const { firstName, lastName, email, role } = await request.json();
    const client = await clerkClient();

    await client.users.createUser({
      emailAddress: [email],
      firstName: firstName,
      lastName: lastName,
      publicMetadata: {
        role: role,
      },
      password: `BRU001@${firstName}`,
    });

    const { data } = await (await clerkClient()).users.getUserList();

    const users = data?.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0].emailAddress,
      photo: user.imageUrl,
      role: user.publicMetadata.role,
    }));

    return NextResponse.json({ message: "User created", users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" });
  }
}

export async function GET() {
  try {
    const { data } = await (await clerkClient()).users.getUserList();

    const users = data?.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0].emailAddress,
      photo: user.imageUrl,
      role: user.publicMetadata.role,
    }));

    return NextResponse.json({ message: "User data", users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetchingt user" });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, firstName, lastName, email, role } = await request.json();
    const client = await clerkClient();

    await client.users.updateUser(id, {
      firstName: firstName,
      lastName: lastName,
      publicMetadata: {
        role: role,
      },
    });

    const { data } = await (await clerkClient()).users.getUserList();
    const users = data?.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0].emailAddress,
      photo: user.imageUrl,
      role: user.publicMetadata.role,
    }));

    return NextResponse.json({ message: "User created", users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" });
  }
}
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await clerkClient();

    await client.users.deleteUser(id);

    const { data } = await (await clerkClient()).users.getUserList();
    const users = data?.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0].emailAddress,
      photo: user.imageUrl,
      role: user.publicMetadata.role,
    }));

    return NextResponse.json({ message: "User created", users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" });
  }
}
