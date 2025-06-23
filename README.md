# Digital Competence Skill Assessment and Certification Framework
A interactive and modular PoC model visualising digital competence across multiple skill domains.

## Overview
This project implements a digital competence assessment and visualisation tool inspired by the "Digital Competence Wheel". With future integration with backend, it aims to evaluate the user's proficiency levels across core digital skill domains and sub-skills, all of which are visualised in a dynamic radial sunburst chart.

**Tech Stack used:** React, TypeScript, Tailwind CSS, shadcn/ui

## Current Status
- Chart and domain/skill structure defined in mock JSON data and mapped to components via custom hook.
- `CompetenceChart` renders an SVG-based sunburst visualisation with:
  - Proficiency rings and domain arcs with labels
  - Tooltips on hover/click for domains and sub-skills
- Mock/demo data is in place and ready for live data integration
- Responsive and mobile-ready layout with extensibility

## Directions and Next Steps
- **Data Integration:** Replace mock JSON/static data with production API integration
- **Assessment Flow:** Implement pages and flows for assessment logic.
- **Internationalisation:** Complete support for English/Vietnamese language toggle

## Setup and Development

**Requirements:**
- Node.js (v18+ recommended)
- npm or yarn for package manager

**Getting Started:**
```bash
# Clone the repository
git clone https://github.com/HuyHG7502/digital-competence.git
cd digital-competence


# Install dependencies
npm install

# Start the development server
npm run dev

# Open https://localhost:5173 in your browser
```