import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { BookingForm } from "@/components/site/BookingForm";
import { bookingSearchSchema } from "@/lib/booking-search";
import { pageHead } from "@/lib/seo";

const title = "Book a Taxi in Ooty — Instant Fare Estimate | Rashe Holidays";
const description =
  "Book a sedan, Innova Crysta, HyCross, Tavera, Tempo Traveller or Urbania in Ooty. See an instant fare estimate and get confirmation within 30 minutes.";

export const Route = createFileRoute("/booking")({
  validateSearch: bookingSearchSchema,
  head: () => pageHead({ title, description, path: "/booking" }),
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
