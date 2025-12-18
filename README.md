# SAR Builder POC

A Proof of Concept application for building Suspicious Activity Reports (SAR) compliant with FIU-IND (Financial Intelligence Unit - India) regulations.

## Project Structure

This project is organized into separate frontend and backend directories:

```
SAR-Builder-POC/
├── frontend/          # React + TypeScript frontend
├── backend/           # Flask backend
├── SBA STR Template.pdf  # Official FIU-IND STR template
└── README.md
```

## Frontend

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui for styling
- React Router for navigation
- pdf-lib for PDF generation

**Setup:**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:8080`

See [frontend/README.md](./frontend/README.md) for detailed documentation.

## Backend

**Technology Stack:**
- Python Flask
- RESTful API architecture

**Setup:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

## Features

- **FIU-IND Compliant Reporting**: Generate Suspicious Transaction Reports (STR) following official guidelines
- **Official Template Integration**: Uses the SBA STR Template.pdf for accurate report generation
- **Interactive Forms**: User-friendly interface with validation
- **PDF Export**: Generate filled PDF reports using the official template
- **Mock Data**: Pre-populated data for testing and demonstration

## Report Sections

1. Details of Report
2. Details of Principal Officer
3. Details of Reporting Branch/Location
4. List of Individuals Linked to Transactions
5. List of Legal Persons/Entities Linked to Transactions
6. List of Accounts Linked to Transactions
7. Details of Suspicious Transaction
8. Details of Action Taken

## Development

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Running the Full Stack

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
python app.py
```

## License

This is a proof of concept project for educational and demonstration purposes.

## Compliance Note

This application generates reports based on FIU-IND's Suspicious Transaction Report format for banking companies. Ensure all data handling complies with applicable regulations and data privacy laws.
