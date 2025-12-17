"""
Flask Backend for SAR Report Portal
Run with: python app.py
Requires: pip install flask flask-cors
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock SAR Report Data
MOCK_SAR_DATA = {
    "reportDetails": {
        "dateOfSending": "2024-03-15",
        "isReplacement": False,
        "originalReportDate": None
    },
    "principalOfficer": {
        "bankName": "STATE BANK OF INDIA",
        "bsrCode": "0012345",
        "fiuIndId": "FIU-SBI-001",
        "bankCategory": "A",
        "officerName": "RAJESH KUMAR SHARMA",
        "designation": "CHIEF COMPLIANCE OFFICER",
        "addressNo": "101, CORPORATE TOWER",
        "street": "NARIMAN POINT",
        "locality": "FORT",
        "cityDistrict": "MUMBAI, MUMBAI",
        "stateCountry": "MAHARASHTRA, INDIA",
        "pinCode": "400021",
        "telephone": "+91-22-22845678",
        "fax": "+91-22-22845679",
        "email": "cco@sbi.co.in"
    },
    "reportingBranch": {
        "branchName": "CONNAUGHT PLACE BRANCH",
        "bsrCode": "0012346",
        "fiuIndId": "FIU-SBI-CP-001",
        "addressNo": "N-45, INNER CIRCLE",
        "street": "CONNAUGHT PLACE",
        "locality": "NEW DELHI",
        "cityDistrict": "NEW DELHI, CENTRAL DELHI",
        "stateCountry": "DELHI, INDIA",
        "pinCode": "110001",
        "telephone": "+91-11-23456789",
        "fax": "+91-11-23456780",
        "email": "cp.branch@sbi.co.in"
    },
    "linkedIndividuals": [
        {"name": "AMIT SINGH VERMA", "customerId": "CUST001234", "annexure": "A1"},
        {"name": "PRIYA SHARMA", "customerId": "CUST001235", "annexure": "A2"},
        {"name": "VIKRAM MALHOTRA", "customerId": "CUST001236", "annexure": "A3"}
    ],
    "linkedEntities": [
        {"name": "ABC TRADING PVT LTD", "customerId": "CORP002345", "annexure": "B1"},
        {"name": "XYZ IMPORTS AND EXPORTS", "customerId": "CORP002346", "annexure": "B2"}
    ],
    "linkedAccounts": [
        {"accountNumber": "1234567890123456", "accountHolderName": "AMIT SINGH VERMA", "annexure": "C1"},
        {"accountNumber": "2345678901234567", "accountHolderName": "ABC TRADING PVT LTD", "annexure": "C2"},
        {"accountNumber": "3456789012345678", "accountHolderName": "PRIYA SHARMA", "annexure": "C3"}
    ],
    "suspiciousTransaction": {
        "reasonsForSuspicion": ["D", "E", "F"],
        "otherReason": None,
        "groundsOfSuspicion": [
            "Multiple high-value cash deposits observed over a period of 30 days totaling INR 48,50,000 structured to avoid threshold reporting.",
            "Deposits made in amounts just below INR 50,000 at different branches on consecutive days.",
            "Account holder claimed to be a small retail trader but transaction volumes inconsistent with declared business.",
            "Immediate transfer of deposited funds to multiple accounts within 24-48 hours of deposit.",
            "Beneficiary accounts traced to shell companies with minimal business activity.",
            "Account activity increased 500% compared to historical average without any business justification.",
            "Similar patterns observed across related accounts held by family members.",
            "Documentation provided for source of funds appears fabricated upon verification."
        ]
    },
    "actionTaken": {
        "investigationDetails": [
            "Internal investigation initiated on 01-Feb-2024 by Compliance Team.",
            "Account frozen on 15-Feb-2024 pending investigation completion.",
            "Matter reported to local police station (FIR No. 123/2024) on 20-Feb-2024.",
            "Enforcement Directorate notified via separate communication dated 25-Feb-2024.",
            "Customer contacted for clarification on 05-Mar-2024, no satisfactory response received."
        ]
    }
}


@app.route('/api/sar-report', methods=['GET'])
def get_sar_report():
    """
    API endpoint to fetch SAR report data.
    Returns mock data for demonstration purposes.
    """
    return jsonify(MOCK_SAR_DATA)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "SAR Report API"})


if __name__ == '__main__':
    print("Starting SAR Report Flask Backend...")
    print("API Endpoints:")
    print("  - GET /api/sar-report - Fetch SAR report data")
    print("  - GET /api/health - Health check")
    app.run(debug=True, port=5000)
