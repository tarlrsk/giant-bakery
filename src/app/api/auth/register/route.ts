import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // TODO implement logic for sign up.
    console.log("Name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);

    return NextResponse.json(
      { message: "Signed up successfully." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "An error occurred while signing up.",
      },
      { status: 500 }
    );
  }
}
