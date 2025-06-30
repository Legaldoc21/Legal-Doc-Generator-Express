const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Generación de documento legal",
            },
            unit_amount: 199, // 1.99€ en céntimos
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    res.status(500).json({ error: "Error creando sesión de pago" });
  }
}