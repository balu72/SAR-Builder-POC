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
import { PDFDocument } from "pdf-lib";
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
    if (!data) return;
    
    setExporting(true);
    toast.info("Generating PDF from template...");
    
    try {
      // Fetch the template PDF
      const templateUrl = '/SBA STR Template.pdf';
      const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
      
      // Load the PDF template
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      
      // Get all form fields
      const fields = form.getFields();
      console.log('Total form fields:', fields.length);
      
      // Export all field names to help identify Parts 6, 7, 8
      const fieldInfo = fields.map((field, index) => ({
        index,
        name: field.getName(),
        type: field.constructor.name
      }));
      
      console.log('=== ALL PDF FORM FIELDS ===');
      console.table(fieldInfo);
      
      // Download field names as JSON for easier analysis
      const fieldJson = JSON.stringify(fieldInfo, null, 2);
      const fieldBlob = new Blob([fieldJson], { type: 'application/json' });
      const fieldUrl = URL.createObjectURL(fieldBlob);
      const fieldLink = document.createElement('a');
      fieldLink.href = fieldUrl;
      fieldLink.download = 'PDF_Field_Names.json';
      document.body.appendChild(fieldLink);
      fieldLink.click();
      document.body.removeChild(fieldLink);
      URL.revokeObjectURL(fieldUrl);
      
      toast.info('Downloaded field names list - check PDF_Field_Names.json');
      
      // Fill in the form fields with actual data mappings
      try {
        // Part 1: Report Details - Date of sending report
        const dateStr = data.reportDetails.dateOfSending; // Format: "2024-03-15"
        const [year, month, day] = dateStr.split('-');
        
        form.getTextField('Date1').setText(day[0]);
        form.getTextField('Date2').setText(day[1]);
        form.getTextField('Month1').setText(month[0]);
        form.getTextField('Month2').setText(month[1]);
        
        // Year field only accepts 1 digit - use last digit only
        try {
          form.getTextField('Year').setText(year[3]); // Use last digit only (4 from 2024)
        } catch (yearError) {
          console.log('Year field error:', yearError);
        }
        
        // Replacement checkbox
        if (data.reportDetails.isReplacement) {
          form.getCheckBox('ReplacementYN').check();
          
          if (data.reportDetails.originalReportDate) {
            const [oYear, oMonth, oDay] = data.reportDetails.originalReportDate.split('-');
            form.getTextField('OrDate1').setText(oDay[0]);
            form.getTextField('OrDate2').setText(oDay[1]);
            form.getTextField('OrMonth1').setText(oMonth[0]);
            form.getTextField('OrMonth2').setText(oMonth[1]);
            
            try {
              form.getTextField('OrYear').setText(oYear[3]); // Use last digit only
            } catch (oYearError) {
              console.log('Original year field error:', oYearError);
            }
          }
        }
        
        // Part 2: Principal Officer
        form.getTextField('NameEntity').setText(data.principalOfficer.bankName);
        form.getTextField('UnqiueCode').setText(data.principalOfficer.bsrCode);
        form.getTextField('IDFIU').setText(data.principalOfficer.fiuIndId);
        form.getTextField('EntityCategory').setText(data.principalOfficer.bankCategory);
        form.getTextField('DesignationPrincipal').setText(`${data.principalOfficer.officerName}, ${data.principalOfficer.designation}`);
        form.getTextField('PrincipalAddress1').setText(data.principalOfficer.addressNo);
        form.getTextField('PrincipalAddress2').setText(data.principalOfficer.street);
        form.getTextField('PrincipalAddress3').setText(data.principalOfficer.locality);
        form.getTextField('PrincipalAddress4').setText(data.principalOfficer.cityDistrict);
        form.getTextField('PrincipalAddress5').setText(data.principalOfficer.stateCountry);
        form.getTextField('PrincipalPIN').setText(data.principalOfficer.pinCode);
        form.getTextField('PrincipalTel').setText(data.principalOfficer.telephone);
        form.getTextField('PrincipalFAX').setText(data.principalOfficer.fax);
        form.getTextField('PrincipalEmail').setText(data.principalOfficer.email);
        
        // Part 3: Reporting Branch
        form.getTextField('NameBranch').setText(data.reportingBranch.branchName);
        form.getTextField('BranchCode').setText(data.reportingBranch.bsrCode);
        form.getTextField('BranchIDFIU').setText(data.reportingBranch.fiuIndId);
        form.getTextField('BranchAddress1').setText(data.reportingBranch.addressNo);
        form.getTextField('BranchAddress2').setText(data.reportingBranch.street);
        form.getTextField('BranchAddress3').setText(data.reportingBranch.locality);
        form.getTextField('BranchAddress4').setText(data.reportingBranch.cityDistrict);
        form.getTextField('BranchAddress5').setText(data.reportingBranch.stateCountry);
        form.getTextField('BranchPIN').setText(data.reportingBranch.pinCode);
        form.getTextField('BranchTel').setText(data.reportingBranch.telephone);
        form.getTextField('BranchFAX').setText(data.reportingBranch.fax);
        form.getTextField('BranchEmail').setText(data.reportingBranch.email);
        
        // Part 4: Linked Individuals (up to 15 individuals)
        data.linkedIndividuals.forEach((individual, index) => {
          if (index < 15) {
            const fieldNum = index + 1;
            form.getTextField(`Individual${fieldNum}`).setText(`${individual.name} | ${individual.customerId} | ${individual.annexure}`);
          }
        });
        
        // Part 5: Linked Entities (up to 3)
        data.linkedEntities.forEach((entity, index) => {
          if (index < 3) {
            const fieldNum = index + 1;
            form.getTextField(`LegalPerson${fieldNum}`).setText(`${entity.name} | ${entity.customerId} | ${entity.annexure}`);
          }
        });
        
        // Part 6: Linked Accounts - NOW WITH ACTUAL CORRECT FIELD NAMES!
        console.log('Filling Part 6 - Accounts...');
        data.linkedAccounts.forEach((account, index) => {
          if (index < 10) {
            const fieldNum = index + 1;
            form.getTextField(`Account${fieldNum}`).setText(account.accountNumber);
            form.getTextField(`AccountHolder${fieldNum}`).setText(account.accountHolderName);
            // Check annexure checkbox if annexure exists
            if (account.annexure) {
              form.getCheckBox(`AccountAnnexureYN${fieldNum}`).check();
            }
          }
        });
        console.log(`Filled ${Math.min(data.linkedAccounts.length, 10)} accounts`);
        
        // Part 7: Suspicious Transaction Details - NOW WITH ACTUAL CORRECT FIELD NAMES!
        console.log('Filling Part 7 - Suspicious Transaction...');
        
        // Check reason checkboxes (A-F, Z)
        data.suspiciousTransaction.reasonsForSuspicion.forEach(reason => {
          if (reason === 'Z') {
            form.getCheckBox('SuspicionCategoryZ').check();
          } else {
            form.getCheckBox(`SuspicionCategory${reason}`).check();
          }
        });
        console.log('Checked reason boxes:', data.suspiciousTransaction.reasonsForSuspicion.join(', '));
        
        // Grounds of suspicion (2 fields available)
        const grounds = data.suspiciousTransaction.groundsOfSuspicion;
        if (grounds.length > 0) {
          form.getTextField('GroundOfSuspicion1').setText(grounds[0]);
        }
        if (grounds.length > 1) {
          const remainingGrounds = grounds.slice(1).join(' | ');
          form.getTextField('GroundOfSuspicion2').setText(remainingGrounds);
        }
        console.log(`Filled ${grounds.length} grounds of suspicion`);
        
        // Part 8: Action Taken - NOW WITH ACTUAL CORRECT FIELD NAME!
        console.log('Filling Part 8 - Action Taken...');
        const actions = data.actionTaken.investigationDetails.join(' | ');
        form.getTextField('ActionTaken').setText(actions);
        console.log(`Filled action taken with ${data.actionTaken.investigationDetails.length} investigation details`);
        
        console.log('✅ Successfully filled ALL Parts 1-8 with form data!');
        
        toast.success('PDF form filled with SAR data');
        
      } catch (fieldError) {
        console.error('Error filling form fields:', fieldError);
        toast.warning('Some fields could not be filled: ' + fieldError);
      }
      
      // Update field appearances before flattening
      form.updateFieldAppearances();
      console.log('Updated field appearances');
      
      // Flatten the form to make it non-editable
      form.flatten();
      console.log('Form flattened');
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      console.log('PDF saved, size:', pdfBytes.length, 'bytes');
      
      // Create a blob and download
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SAR_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to export PDF: ${error}`);
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

      <div ref={reportRef} className="bg-background">
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
