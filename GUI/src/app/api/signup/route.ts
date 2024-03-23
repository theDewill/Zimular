import User from "@/models/User";
import connect  from "@/utils/db";
import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

connect();

export const POST = async (request: NextRequest) => {
  

  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //Check if the user Exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }
    
    //Hash the password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({
      message: "User created successfully",
      success: true,
    })
    
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
