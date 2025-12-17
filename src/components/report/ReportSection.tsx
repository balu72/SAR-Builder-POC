import { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  partNumber: string;
  children: ReactNode;
}

const ReportSection = ({ title, partNumber, children }: ReportSectionProps) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
      <div className="bg-primary/5 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            PART {partNumber}
          </span>
          <h2 className="font-display font-semibold text-lg text-foreground">
            {title}
          </h2>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ReportSection;
