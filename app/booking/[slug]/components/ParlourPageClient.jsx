import { ParlourHeader } from "./ParlourHeader";
import { BookingWizard } from "./BookingWizard";
import { AboutSection } from "./AboutSection";

export function ParlourPageClient({ slug, initialParlour }) {
  const parlour = initialParlour;

  const resolvedParlourId = parlour?._id || parlour?.id || "";
  const resolvedOrgId =
    typeof parlour?.organizationId === "string"
      ? parlour?.organizationId
      : parlour?.organizationId?._id || "";

  const name = parlour?.name || "";
  const organizationId = resolvedOrgId || "";
  const address = parlour?.address || "";
  const phone = parlour?.phone || "";
  const providerType = parlour?.providerType || "salon";
  const serviceTypes = parlour?.serviceTypes || [];
  const coverImage = parlour?.coverImage || "/images/parlour-hero.jpg";
  const socialMediaUrl = parlour?.socialMediaUrl || {};
  const serviceLocationMode = parlour?.serviceLocationMode || "in-salon";
  const parlourId = resolvedParlourId;
  const workingHours = parlour?.workingHours || {};
  const slotDurationMinutes = parlour?.slotDurationMinutes ?? 30;

  return (
    <div className="">
      <ParlourHeader
        name={name}
        address={address}
        phone={phone}
        providerType={providerType}
        serviceTypes={serviceTypes}
        coverImage={coverImage}
        socialMediaUrl={socialMediaUrl}
      />

      <div className="container mx-auto px-4 md:px-6 py-10">
        <section className="">
          <AboutSection about={parlour?.about} name={name} />
        </section>

        <section className="mt-16 mb-8" id="booking-section">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 md:mb-4">
                Book Your Appointment
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
                Ready for your transformation? Book your appointment in just a few simple steps.
              </p>
            </div>
            <BookingWizard
              providerType={providerType}
              organizationId={organizationId}
              serviceLocationMode={serviceLocationMode}
              parlourId={parlourId}
              workingHours={workingHours}
              slotDurationMinutes={slotDurationMinutes}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
