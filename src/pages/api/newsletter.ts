import type { APIRoute } from "astro";

// This endpoint requires server-side rendering
export const prerender = false;

// Using your existing Formspree ID from contact.astro
const FORMSPREE_ID = "mdkogvoy";

export const POST: APIRoute = async ({ request }) => {
  // Validate request method
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Submit to Formspree
    const formspreeUrl = `https://formspree.io/f/${FORMSPREE_ID}`;
    const response = await fetch(formspreeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        subject: "New Newsletter Subscription",
        message: `New newsletter subscription request from: ${email}`,
      }),
    });

    // Log the response for debugging
    const responseText = await response.text();
    console.log("Formspree response status:", response.status);
    console.log("Formspree response body:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to submit to Formspree: ${response.status} ${responseText}`,
      );
    }

    return new Response(
      JSON.stringify({
        message: "Successfully subscribed to newsletter",
        ok: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Failed to subscribe",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
