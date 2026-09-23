import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { BookingForm } from "@/components/site/BookingForm";
import { bookingSearchSchema } from "@/lib/booking-search";

const title = "Book a Cab in Ooty — Enquiry Form | Rashe Holidays";
const description =
  "Send a booking enquiry for a 4-seater car, Innova HyCross or 19-seater Traveller in Ooty. See an instant fare estimate and get confirmation within 30 minutes.";

export const Route = createFileRoute("/booking")({
  validateSearch: bookingSearchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const search = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Tell us about"
        accent="your trip"
        description="Fill in the details below and see a live fare estimate. Our travel team confirms availability, driver details and the final price within 30 minutes."
      />
      <section className="section-y">
        <div className="container-x">
          <BookingForm initial={search} />
        </div>
      </section>
    </>
  );
}
