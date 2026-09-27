import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, grossAmount, customerDetails } = await request.json();

    // Mengambil Server Key dari .env atau langsung fallback ke key kamu
    const serverKey =
      process.env.MIDTRANS_SERVER_KEY ||
      "SB-Mid-server-Ax418u6KFd6oSGPrEfo_L44p";

    // Encode Basic Auth (Server Key + ":")
    const authString = Buffer.from(`${serverKey.trim()}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: orderId || `OWNSTORE-${Date.now()}`,
        gross_amount: Math.round(Number(grossAmount)),
      },
      customer_details: customerDetails || {
        first_name: "Customer",
        email: "customer@example.com",
      },
    };

    // Request langsung ke Midtrans Snap Sandbox API
    const response = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Midtrans Error Response:", data);
      return NextResponse.json(
        { error: data.error_messages ? data.error_messages.join(", ") : "Gagal ke Midtrans" },
        { status: response.status }
      );
    }

    return NextResponse.json({ token: data.token });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}