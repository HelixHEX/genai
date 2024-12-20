import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together();

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const response = await together.images.create({
    prompt: body.prompt,
    model: "black-forest-labs/FLUX.1-schnell",
    width: 1024,
    height: 768,
    steps: 3,
    response_format: "base64",
  });



  return NextResponse.json({ image: response.data[0] })
}