import { BookingStatus, Payment } from "@naturechill/db";
import { z } from "zod";
import {
  BookingService,
  GetQuoteSchema,
  validateDateRange,
} from "../services/BookingService";
import { t } from "../trpc";
import moment from "moment-timezone";
import Stripe from "stripe";
import { i18n } from "../../i18n-config";
import { prisma } from "../prisma";

const CreateCheckoutSessionSchema = z.object({
  guests: z.number(),
  startDate: z.number(),
  endDate: z.number(),
  origin: z.string(),
  email: z.string(),
  amount: z.number(),
  locale: z.enum(i18n.locales),
});

type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;

const createCheckoutSession = async ({
  guests,
  startDate,
  endDate,
  origin,
  email,
  amount,
  locale,
}: CreateCheckoutSessionInput) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  });

  const start = moment(startDate).tz("Europe/Budapest").format("L");
  const end = moment(endDate).tz("Europe/Budapest").format("L");
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "huf",
          product_data: {
            name: "Luxus Faház, Vörösfenyő",
            description: `Foglalás: ${start} - ${end}. ${guests} Vendég`,
          },
          unit_amount: amount * 100,
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: email,
    billing_address_collection: "required",
    locale,
  });
  return session;
};

const getBookings = t.procedure.query(async () => {
  const bookings = await BookingService.getBookings();

  return bookings;
});

const book = t.procedure
  .input(
    z.object({
      email: z.string().email(),
      startDate: z.number(),
      endDate: z.number(),
      paymentKind: z.nativeEnum(Payment),
      guests: z.number(),
      locale: z.enum(i18n.locales),
      breakfast: z.boolean(),
      pet: z.boolean(),
    })
  )
  .mutation(
    async ({
      input: {
        startDate,
        endDate,
        paymentKind,
        guests,
        email,
        locale,
        breakfast,
        pet,
      },
      ctx,
    }) => {
      const bookings = await prisma.booking.findMany({
        where: {
          status: { not: BookingStatus.CANCELLED },
        },
        select: {
          endDate: true,
          startDate: true,
          status: true,
          id: true,
        },
      });

      validateDateRange(
        { from: new Date(startDate), to: new Date(endDate) },
        bookings
      );

      const start = moment(startDate).tz("Europe/Budapest").hour(14).minute(0);
      const end = moment(endDate).tz("Europe/Budapest").hour(12).minute(0);

      const cost = BookingService.calculateTotalCost(
        moment(startDate),
        moment(endDate),
        paymentKind,
        breakfast,
        pet
      ); // todo use moment

      const session = await createCheckoutSession({
        amount: cost.deposit,
        email,
        endDate,
        startDate,
        guests,
        origin: ctx.origin ?? "",
        locale,
      });

      await BookingService.book({
        startDate: start.toDate(),
        endDate: end.toDate(),
        paymentKind,
        email,
        sessionId: session.id,
        breakfast,
        pet,
      });

      return session.id;
    }
  );

const getQuote = t.procedure
  .input(GetQuoteSchema)
  .query(
    async ({ input: { startDate, endDate, paymentKind, breakfast, pet } }) => {
      const bookings = await prisma.booking.findMany({
        where: {
          status: { not: BookingStatus.CANCELLED },
        },
        select: {
          endDate: true,
          startDate: true,
          status: true,
          id: true,
        },
      });

      validateDateRange(
        { from: new Date(startDate), to: new Date(endDate) },
        bookings
      );

      const totalCost = BookingService.calculateTotalCost(
        moment(startDate),
        moment(endDate),
        paymentKind,
        breakfast,
        pet
      );

      console.log({
        amount: totalCost,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paymentKind,
        breakfast,
        pet,
      });

      return {
        amount: totalCost,
      };
    }
  );

const bookingRouter = t.router({
  getBookings,
  book,
  getQuote,
});

export default bookingRouter;
