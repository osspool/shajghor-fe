"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_METHOD_OPTIONS } from "@/constants/booking-constants";
import { useBookingPayment } from "@/hooks/query/useTransactions";
import { DialogWrapper } from "@/components/custom/ui/dialog-wrapper";
import SelectInput from "@/components/form-utils/select-input";
import { generateUUID } from "@/lib/utils";

export function BookingPaymentDialog({
  open,
  onOpenChange,
  action = "receive", // 'receive' | 'refund'
  booking,
  token,
  defaultAmount,
  defaultMethod,
  title,
}) {
  const { bookingPayment, isProcessing } = useBookingPayment();

  const initialAmount = useMemo(() => {
    if (typeof defaultAmount === "number") return defaultAmount;
    const services = booking?.services || [];
    const sum = services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const additional = Number(booking?.additionalCost) || 0;
    return sum + additional;
  }, [booking, defaultAmount]);

  const [amount, setAmount] = useState(String(initialAmount || 0));
  const [method, setMethod] = useState(defaultMethod || booking?.paymentMethod || "cash");
  const [walletNumber, setWalletNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");

  useEffect(() => {
    setAmount(String(initialAmount || 0));
    setMethod(defaultMethod || booking?.paymentMethod || "cash");
    setWalletNumber("");
    setTransactionId("");
    setSenderName("");
    setBankName("");
    setAccountNumber("");
    setIdempotencyKey(generateUUID());
  }, [open, initialAmount, defaultMethod, booking?.paymentMethod]);

  const heading = title || (action === "refund" ? "Refund Payment" : "Receive Payment");

  const handleConfirm = () => {
    // Build payment details dynamically like TransactionForm
    let paymentDetails = undefined;
    if (method !== "cash") {
      if (method === "bank") {
        paymentDetails = {
          provider: "bank",
          bankName: bankName || undefined,
          accountNumber: accountNumber || undefined,
          transactionId: transactionId || undefined,
          senderName: senderName || undefined,
        };
      } else {
        paymentDetails = {
          provider: method,
          walletNumber: walletNumber || undefined,
          transactionId: transactionId || undefined,
          senderName: senderName || undefined,
        };
      }
    }
    const keyToUse = transactionId?.trim() ? transactionId.trim() : idempotencyKey;
    bookingPayment({
      action,
      booking,
      overrides: { amount: Number(amount) || 0, method, paymentDetails, idempotencyKey: keyToUse },
      token,
    });
    onOpenChange?.(false);
  };

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
      <Button onClick={handleConfirm} disabled={isProcessing} {...(action === "refund" ? { variant: "destructive" } : {})}>
        {action === "refund" ? "Confirm Refund" : "Confirm"}
      </Button>
    </>
  );

  return (
    <DialogWrapper open={open} onOpenChange={onOpenChange} title={heading} footer={footer} size="sm">
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1">
          <div className="text-sm">Amount (৳)</div>
          <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1">
          <div className="text-sm">Method</div>
          <SelectInput items={PAYMENT_METHOD_OPTIONS} value={method} onValueChange={setMethod} placeholder="Select method" />
        </div>
        {method !== "cash" && (
          <>
            {method === "bank" ? (
              <>
                <div className="space-y-1">
                  <div className="text-sm">Bank Name</div>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Account Number</div>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Transaction ID</div>
                  <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Sender Name</div>
                  <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="text-sm">Wallet/Account No</div>
                  <Input value={walletNumber} onChange={(e) => setWalletNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Transaction ID</div>
                  <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm">Sender Name</div>
                  <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DialogWrapper>
  );
}


