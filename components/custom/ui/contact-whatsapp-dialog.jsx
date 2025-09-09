"use client";

import { useState } from "react";
import { DialogWrapper } from "@/components/custom/ui/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/constants/contact-info";

export function ContactWhatsappDialog({
  trigger,
  title = "Contact Us",
  description = "We'll connect you on WhatsApp to help you right away.",
  message,
  size = "sm",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = controlledOnOpenChange || setUncontrolledOpen;

  const whatsappUrl = getWhatsAppUrl(message);

  const footer = (
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button>
          Continue on WhatsApp
        </Button>
      </a>
    </>
  );

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      size={size}
      footer={footer}
      trigger={trigger}
    >
      <div className="text-sm text-muted-foreground">
        Click continue to open WhatsApp and chat with our team.
      </div>
    </DialogWrapper>
  );
}

export default ContactWhatsappDialog;


