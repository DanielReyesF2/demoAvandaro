# Overview

Econova is a comprehensive environmental management system designed for Club Campestre Ciudad de México (CCCM), expanded from a waste-only application to an integrated sustainability platform. The system now encompasses four key environmental modules: Energy, Water, Waste, and Circular Economy, providing holistic environmental performance tracking and management.

The system maintains its original waste management capabilities while adding energy efficiency monitoring, water conservation tracking, and an advanced circular economy index that integrates all environmental factors. Built for potential commercial sale to the client, featuring sophisticated environmental analytics and TRUE Zero Waste certification progress tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Major Changes (Aug 2025)
- **Scope Expansion**: Evolved from waste-only tracking to comprehensive environmental management platform
- **Commercial Opportunity**: System now designed for potential sale to Club Campestre as integrated solution
- **Modular Architecture**: Four environmental modules (Energy, Water, Waste, Circular Economy) with dedicated pages
- **Circular Economy Integration**: Advanced index calculation combining all environmental factors for holistic sustainability assessment
- **Club Infrastructure Integration**: Added PTAR wastewater treatment plant and lagoon system for water module, solar panel implementation planning for energy module
- **Dashboard Redesign**: Eliminated rigid card layouts for more natural, interactive environmental module design
- **TRUE Zero Waste Certification**: Implemented "Año TRUE" functionality with 12-month rolling period calculation (Aug 2024 - Jul 2025) for certification compliance
- **Enhanced Data Management**: Improved save button UX with permanent visibility, smart disabled states, and cross-year data compatibility

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Styling**: Tailwind CSS with custom design system using navy (#273949) and lime (#b5e951) brand colors
- **UI Components**: Radix UI headless components with shadcn/ui design system
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics dashboards

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with structured error handling
- **File Processing**: Multer for file uploads with PDF processing capabilities
- **External APIs**: OpenAI integration for document analysis and data extraction

## Data Storage Solutions
- **Database**: PostgreSQL with connection pooling via Neon Serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Structured schema with clients, documents, waste_data, and alerts tables
- **Migrations**: Drizzle Kit for database schema management and migrations

## Authentication and Authorization
- **Current State**: No authentication system implemented (internal application)
- **Session Management**: Basic session handling through Express middleware
- **Access Control**: Client-based data isolation through database queries

## Data Processing Pipeline
- **Document Upload**: Multi-part form uploads stored in local filesystem
- **PDF Analysis**: Combination of filename pattern matching and OpenAI-powered content extraction
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Automated Processing**: Background processing of uploaded documents with error handling

## Environmental Management Features
- **Waste Management**: Organic (including PODA), inorganic, and recyclable waste tracking with TRUE Zero Waste certification progress
- **Energy Monitoring**: Solar energy generation project in planning phase, consumption patterns, efficiency metrics, and renewable energy percentage tracking
- **Water Conservation**: PTAR (Wastewater Treatment Plant) and lagoon system for golf course irrigation, consumption monitoring, recycling systems, and quality parameters tracking
- **Circular Economy Index**: Integrated sustainability score combining all environmental factors (72% current index)
- **Environmental Impact**: Comprehensive calculation of trees saved, water conserved, energy saved, and CO₂ reduction across all modules
- **Sustainability Metrics**: Multi-dimensional progress tracking with targets for 2026 (85% circularity goal)

## Report Generation
- **PDF Reports**: jsPDF-based comprehensive sustainability reports
- **Data Export**: CSV export functionality for waste data
- **Period Selection**: Configurable reporting periods (monthly, quarterly, annual)
- **Brand Integration**: Custom branded reports with client logos and corporate identity

# External Dependencies

## Database and Infrastructure
- **Neon Serverless**: PostgreSQL database hosting with connection pooling
- **WebSocket Support**: Real-time capabilities through ws library for database connections

## PDF Processing and Generation
- **jsPDF**: Client-side PDF generation for reports and documentation
- **jsPDF AutoTable**: Table generation plugin for structured data presentation
- **OpenAI API**: GPT-4o model for intelligent document content extraction and analysis

## UI and Design
- **Radix UI**: Headless component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom brand configuration
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Anton and Ruda font families for brand typography

## Development Tools
- **Vite**: Build tool with HMR and development server
- **Replit Integration**: Development environment integration with cartographer and error modal plugins
- **TypeScript**: Type safety across the entire application stack
- **ESLint/Prettier**: Code quality and formatting tools

## File Processing
- **Multer**: Express middleware for handling multipart/form-data uploads
- **Canvas**: Node.js Canvas API for image processing and manipulation
- **PapaParse**: CSV parsing library for data import/export functionality

## Additional Libraries
- **Class Variance Authority**: Utility for creating type-safe component variants
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date utility library for temporal data manipulation
- **CMDK**: Command palette component for enhanced user interactions