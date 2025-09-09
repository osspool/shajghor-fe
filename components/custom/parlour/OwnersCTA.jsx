"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp } from "lucide-react";
import ContactWhatsappDialog from "@/components/custom/ui/contact-whatsapp-dialog";

export function OwnersCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gradient-card border-y">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Own a Beauty Parlour?</h3>
            <p className="text-muted-foreground">
              Join our platform and reach thousands of customers looking for
              beauty services
            </p>
          </div>
          <div className="flex gap-3">
            <ContactWhatsappDialog
              open={open}
              onOpenChange={setOpen}
              title="List Your Business"
              description="We'll connect you on WhatsApp to help you get started."
              trigger={(
                <Button variant="outline" size="lg">
                  <Store className="h-5 w-5 mr-2" />
                  List Your Business
                </Button>
              )}
            />
            <Button size="lg">
              <TrendingUp className="h-5 w-5 mr-2" />
              Start Growing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
