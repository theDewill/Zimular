import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

connect();

export const POST = async (request: NextRequest) => {
  

  try {
    const { email, password } = await request.json();

    //Check if the user Exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }
    
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
    
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
