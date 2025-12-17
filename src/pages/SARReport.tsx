import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import ReportSection from "@/components/report/ReportSection";
import FormField from "@/components/report/FormField";
import DataTable from "@/components/report/DataTable";
import { SARReportData } from "@/types/sarReport";
import { mockSARData } from "@/data/mockSARData";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

const SARReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SARReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call to Flask backend
    const fetchData = async () => {
      setLoading(true);
      try {
        // In production, this would be: const response = await fetch('/api/sar-report');
        // For now, we simulate the delay and use mock data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setData(mockSARData);
      } catch (error) {
        console.error("Error fetching SAR data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const suspicionReasonLabels: Record<string, string> = {
    A: "Identity of client",
    B: "Background of client",
    C: "Multiple accounts",
    D: "Activity in account",
    E: "Nature of transaction",
    F: "Value of transaction",
    Z: "Other reason",
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExporting(true);
    toast.info("Generating PDF...");
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f8fafc",
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;
      
      let yOffset = 0;
      let pageCount = 0;
      
      while (yOffset < scaledHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -yOffset,
          pdfWidth,
          scaledHeight
        );
        
        yOffset += pdfHeight;
        pageCount++;
      }
      
      pdf.save(`SAR_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load report data</p>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-display font-bold text-lg text-foreground">
                Suspicious Transaction Report (STR)
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button size="sm" className="gap-2" onClick={handleExportPDF} disabled={exporting}>
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div ref={reportRef}>
      {/* Report Header Banner */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">FIU-IND Financial Intelligence Unit - India</p>
            <h2 className="font-display font-bold text-2xl text-foreground">
              SUSPICIOUS TRANSACTION REPORT (STR)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">FOR A BANKING COMPANY</p>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Part 1: Report Details */}
        <ReportSection title="DETAILS OF REPORT" partNumber="1">
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              label="Date of sending report"
              value={data.reportDetails.dateOfSending}
              fieldNumber="1.1"
            />
            <FormField
              label="Is this a replacement to an earlier report?"
              value={data.reportDetails.isReplacement ? "YES" : "NO"}
              fieldNumber="1.2"
            />
            <FormField
              label="Date of original report (if replacement)"
              value={data.reportDetails.originalReportDate}
              fieldNumber="1.3"
            />
          </div>
        </ReportSection>

        {/* Part 2: Principal Officer */}
        <ReportSection title="DETAILS OF PRINCIPAL OFFICER" partNumber="2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Name of Bank" value={data.principalOfficer.bankName} fieldNumber="2.1" />
            <FormField label="BSR Code" value={data.principalOfficer.bsrCode} fieldNumber="2.2" />
            <FormField label="ID allotted by FIU-IND" value={data.principalOfficer.fiuIndId} fieldNumber="2.3" />
            <FormField label="Category of Bank" value={data.principalOfficer.bankCategory} fieldNumber="2.4" />
            <FormField label="Name of Principal Officer" value={data.principalOfficer.officerName} fieldNumber="2.5" />
            <FormField label="Designation" value={data.principalOfficer.designation} fieldNumber="2.6" />
            <FormField label="Address (No., Building)" value={data.principalOfficer.addressNo} fieldNumber="2.7" />
            <FormField label="Street/Road" value={data.principalOfficer.street} fieldNumber="2.8" />
            <FormField label="Locality" value={data.principalOfficer.locality} fieldNumber="2.9" />
            <FormField label="City/Town, District" value={data.principalOfficer.cityDistrict} fieldNumber="2.10" />
            <FormField label="State, Country" value={data.principalOfficer.stateCountry} fieldNumber="2.11" />
            <FormField label="Pin Code" value={data.principalOfficer.pinCode} fieldNumber="2.12" />
            <FormField label="Tel (with STD code)" value={data.principalOfficer.telephone} fieldNumber="2.13" />
            <FormField label="Fax" value={data.principalOfficer.fax} fieldNumber="2.14" />
            <FormField label="E-mail" value={data.principalOfficer.email} fieldNumber="2.15" />
          </div>
        </ReportSection>

        {/* Part 3: Reporting Branch */}
        <ReportSection title="DETAILS OF REPORTING BRANCH / LOCATION" partNumber="3">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Name of Branch/Location" value={data.reportingBranch.branchName} fieldNumber="3.1" />
            <FormField label="BSR Code" value={data.reportingBranch.bsrCode} fieldNumber="3.2" />
            <FormField label="ID allotted by FIU-IND" value={data.reportingBranch.fiuIndId} fieldNumber="3.3" />
            <FormField label="Address (No., Building)" value={data.reportingBranch.addressNo} fieldNumber="3.4" />
            <FormField label="Street/Road" value={data.reportingBranch.street} fieldNumber="3.5" />
            <FormField label="Locality" value={data.reportingBranch.locality} fieldNumber="3.6" />
            <FormField label="City/Town, District" value={data.reportingBranch.cityDistrict} fieldNumber="3.7" />
            <FormField label="State, Country" value={data.reportingBranch.stateCountry} fieldNumber="3.8" />
            <FormField label="Pin Code" value={data.reportingBranch.pinCode} fieldNumber="3.9" />
            <FormField label="Tel (with STD code)" value={data.reportingBranch.telephone} fieldNumber="3.10" />
            <FormField label="Fax" value={data.reportingBranch.fax} fieldNumber="3.11" />
            <FormField label="E-mail" value={data.reportingBranch.email} fieldNumber="3.12" />
          </div>
        </ReportSection>

        {/* Part 4: Linked Individuals */}
        <ReportSection title="LIST OF INDIVIDUALS LINKED TO TRANSACTIONS" partNumber="4">
          <DataTable
            columns={[
              { header: "Name of Individual", accessor: "name" },
              { header: "Customer ID/Number", accessor: "customerId" },
              { header: "Annexure", accessor: "annexure" },
            ]}
            data={data.linkedIndividuals}
          />
        </ReportSection>

        {/* Part 5: Legal Entities */}
        <ReportSection title="LIST OF LEGAL PERSONS/ENTITIES LINKED TO TRANSACTIONS" partNumber="5">
          <DataTable
            columns={[
              { header: "Name of Legal Person/Entity", accessor: "name" },
              { header: "Customer ID/Number", accessor: "customerId" },
              { header: "Annexure", accessor: "annexure" },
            ]}
            data={data.linkedEntities}
          />
        </ReportSection>

        {/* Part 6: Linked Accounts */}
        <ReportSection title="LIST OF ACCOUNTS LINKED TO TRANSACTIONS" partNumber="6">
          <DataTable
            columns={[
              { header: "Account Number", accessor: "accountNumber" },
              { header: "Name of First Account Holder", accessor: "accountHolderName" },
              { header: "Annexure", accessor: "annexure" },
            ]}
            data={data.linkedAccounts}
          />
        </ReportSection>

        {/* Part 7: Suspicious Transaction Details */}
        <ReportSection title="DETAILS OF SUSPICIOUS TRANSACTION" partNumber="7">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                <span className="text-xs text-primary font-semibold mr-2">7.1</span>
                Reasons for Suspicion
              </label>
              <div className="flex flex-wrap gap-2">
                {data.suspiciousTransaction.reasonsForSuspicion.map((reason) => (
                  <Badge key={reason} variant="secondary" className="px-3 py-1.5">
                    <span className="font-bold mr-1">{reason}</span>
                    {suspicionReasonLabels[reason]}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                <span className="text-xs text-primary font-semibold mr-2">7.2</span>
                Grounds of Suspicion
              </label>
              <div className="space-y-2">
                {data.suspiciousTransaction.groundsOfSuspicion.map((ground, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground text-sm"
                  >
                    <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                    {ground}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ReportSection>

        {/* Part 8: Action Taken */}
        <ReportSection title="DETAILS OF ACTION TAKEN" partNumber="8">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              <span className="text-xs text-primary font-semibold mr-2">8.1</span>
              Investigation Details
            </label>
            <div className="space-y-2">
              {data.actionTaken.investigationDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-muted/50 border border-border rounded-md px-4 py-3 text-foreground text-sm"
                >
                  <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                  {detail}
                </div>
              ))}
            </div>
          </div>
        </ReportSection>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground py-6 border-t border-border">
          <p>FOR FIU-IND USE ONLY</p>
          <p className="mt-1">This report is generated in compliance with PMLA 2002 regulations.</p>
        </div>
      </main>
      </div>
    </div>
  );
};

export default SARReport;
