import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Card } from "@/components/ui/card";
import { FileText, DollarSign, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ListerActivity() {
  const { transactions, lister, getBondById } = useBondContext();
  
  // Filter transactions related to this lister
  const listerTransactions = transactions
    .filter(t => t.fromId === lister.id || t.toId === lister.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <FileText className="w-4 h-4" />;
      case 'purchase':
        return <DollarSign className="w-4 h-4" />;
      case 'issuance':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'listing':
        return 'bg-primary/20 text-primary';
      case 'purchase':
        return 'bg-success/20 text-success';
      case 'issuance':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-muted/30 text-muted-foreground';
    }
  };

  return (
    <DashboardLayout title="Activity" subtitle="Track all activity related to your listings">
      <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
        {listerTransactions.length > 0 ? (
          <div className="space-y-4">
            {listerTransactions.map((tx, index) => {
              const bond = getBondById(tx.bondId);
              const isIncoming = tx.toId === lister.id;
              
              return (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      getTransactionColor(tx.type)
                    )}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {bond && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-primary">{bond.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {isIncoming ? (
                          <ArrowDownRight className="w-4 h-4 text-success" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={cn(
                          "font-medium",
                          isIncoming ? "text-success" : "text-foreground"
                        )}>
                          ${tx.value.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {tx.amount.toLocaleString()} units
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      tx.status === 'completed' ? 'bg-success/20 text-success' :
                      tx.status === 'pending' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Activity Yet</h3>
            <p className="text-muted-foreground">
              Activity will appear here once you create listings and investors start purchasing.
            </p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
