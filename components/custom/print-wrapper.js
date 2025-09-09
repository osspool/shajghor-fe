// src/components/custom/PrintWrapper.js
"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const PrintWrapper = ({ children, title }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Updated from 'content' to 'contentRef'
    documentTitle: title || "document",
    onAfterPrint: () => console.log("Print Success"),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with print button */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4 no-print">
          <h1 className="text-xl font-semibold text-gray-800">
            {title || "Document"}
          </h1>
          <Button
            variant="default"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>

        {/* Printable content */}
        <div ref={componentRef} className="bg-white rounded-lg shadow-sm">
          {children}
        </div>

        {/* Footer is already included in the invoice preview */}
      </div>
    </div>
  );
};

export default PrintWrapper;
