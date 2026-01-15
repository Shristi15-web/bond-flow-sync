import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  MessageSquare, Mail, FileText, ExternalLink,
  HelpCircle, Book, Video
} from "lucide-react";

export default function ListerSupport() {
  return (
    <DashboardLayout title="Support" subtitle="Get help with your lister account">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Contact Support */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Contact Support
          </h3>
          <p className="text-muted-foreground mb-6">
            Have questions about listing bonds or need technical assistance? Our team is here to help.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Live Chat</p>
                <p className="text-sm text-muted-foreground">Chat with our team</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email Support</p>
                <p className="text-sm text-muted-foreground">support@bondfi.com</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Resources */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Book className="w-5 h-5 text-primary" />
            Resources
          </h3>
          <div className="space-y-3">
            <a 
              href="#" 
              className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Lister Documentation</p>
                  <p className="text-sm text-muted-foreground">Learn how to create and manage listings</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="#" 
              className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Video Tutorials</p>
                  <p className="text-sm text-muted-foreground">Step-by-step guides for listers</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="#" 
              className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">FAQ</p>
                  <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </Card>

        {/* Submit Ticket */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Submit a Support Ticket</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
              <input
                type="text"
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <select className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                <option>Listing Issues</option>
                <option>Account & Verification</option>
                <option>Technical Problems</option>
                <option>Billing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <GradientButton className="w-full">Submit Ticket</GradientButton>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
