import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useBondContext } from "@/context/BondContext";
import { FileText } from "lucide-react";

export default function InvestorTransactions() {
  const { transactions, investor } = useBondContext();
  const investorTx = transactions.filter(t => t.fromId === investor.id || t.toId === investor.id).reverse();

  return (
    <DashboardLayout title="Transactions" subtitle="Your complete transaction history">
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          </div>
          <span className="text-sm text-muted-foreground">{investorTx.length} transactions</span>
        </div>

        {investorTx.length > 0 ? (
          <div className="space-y-3">
            {investorTx.map((tx, index) => (
              <div 
                key={tx.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TransactionItem 
                  type={tx.type} 
                  description={tx.description} 
                  amount={tx.amount} 
                  value={tx.value} 
                  timestamp={tx.timestamp} 
                  status={tx.status} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No transactions yet</p>
            <p className="text-sm mt-2">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
