"use client";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/query/useTransactions";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function BookingTransactionsSummary({ token, booking, totalAmount }) {
  const bookingId = booking?._id;

  const { transactions: relatedTxns = [], isLoading } = useTransactions(
    token,
    { bookingId, limit: 10 },
    { public: false }
  );

  const summary = useMemo(() => {
    const paid = relatedTxns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const refunded = relatedTxns
      .filter((t) => t.type === "expense" && t.category === "refund")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const totalDue = Number(totalAmount) || 0;
    const balance = totalDue - paid + refunded;
    return { paid, refunded, totalDue, balance };
  }, [relatedTxns, totalAmount]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 text-xs mt-2">
        <div className="rounded-md border p-2">
          <div className="text-muted-foreground">Paid</div>
          <div className="font-medium">৳{summary.paid}</div>
        </div>
        <div className="rounded-md border p-2">
          <div className="text-muted-foreground">Refunded</div>
          <div className="font-medium">৳{summary.refunded}</div>
        </div>
        <div className="rounded-md border p-2">
          <div className="text-muted-foreground">Balance</div>
          <div className="font-medium">৳{summary.balance}</div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-sm font-medium mb-1">Recent Payments</div>
        {isLoading ? (
          <div className="text-xs text-muted-foreground">Loading...</div>
        ) : relatedTxns.length === 0 ? (
          <div className="text-xs text-muted-foreground">No transactions yet.</div>
        ) : (
          <div className="space-y-1">
            {relatedTxns.map((t) => {
              const isIncome = t.type === "income";
              const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
              const color = isIncome ? "text-emerald-600" : "text-rose-600";
              const dateStr = new Date(t.date || t.createdAt).toLocaleDateString("en-GB");
              return (
                <div key={t._id} className="flex items-center justify-between rounded-md border bg-card px-2 py-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <span className="capitalize">{t.method}</span>
                    <span className="text-muted-foreground">{dateStr}</span>
                  </div>
                  <div className={`text-xs font-medium ${color}`}>{isIncome ? "" : "-"}৳{t.amount}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}


