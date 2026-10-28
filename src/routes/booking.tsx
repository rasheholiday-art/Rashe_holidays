import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { BookingForm } from "@/components/site/BookingForm";
import { bookingSearchSchema } from "@/lib/booking-search";
import { pageHead } from "@/lib/seo";

const title = "Book a Taxi in Ooty — Quick Booking Request | Rashe Holidays";
const description =
  "Book a sedan, Innova Crysta, HyCross, Tavera, Traveller or Urbania in Ooty. Send a request and our team will contact you within 15 minutes.";

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
        description="Fill in the details below. Our travel team will contact you within 15 minutes to confirm availability and driver details."
      />
      <section className="section-y">
        <div className="container-x">
          <BookingForm initial={search} />
        </div>
      </section>
    </>
  );
}
