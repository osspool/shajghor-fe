import { Badge } from "@/components/ui/badge";

// const stats = [
//   { icon: Users, label: "Happy Clients", value: "2000+" },
//   { icon: Award, label: "Years Experience", value: "8+" },
//   { icon: Heart, label: "Services", value: "25+" },
//   { icon: Clock, label: "Working Hours", value: "9-8 PM" },
// ];

export const AboutSection = ({ about, name }) => {
  if (!about) return null;
  return (
      <div className="w-full">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start md:items-center">
          {/* Content */}
          <div className="md:col-span-7 space-y-6 md:space-y-8">
            <div>
              <Badge variant="outline" className="mb-4">
                About {name}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
                {about?.title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {about?.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-5 lg:pl-4 md:self-center">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {about?.features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 min-w-0">
                  <span className="mt-1 h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm text-muted-foreground leading-snug break-words">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
  );
};
