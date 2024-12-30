# Organization Team Dashboard

A modern web application for managing team organization and member information.

## Features

- Team member management with detailed profiles
- File upload capabilities for member documents
- Interactive dashboard interface
- TypeScript and React-based frontend for type safety and maintainability

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd org-team-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
org-team-dashboard/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx          # File upload component
│   │   ├── HierarchicalList.tsx    # Organization hierarchy display
│   │   ├── MemberForm.tsx          # Member creation/edit form
│   │   ├── OrganizationForm.tsx    # Organization creation/edit form
│   │   ├── TeamForm.tsx            # Team creation/edit form
│   │   ├── theme-provider.tsx      # Theme configuration
│   │   └── ui/                     # UI components library
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client configuration
│   │   └── utils.ts                # Utility functions
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Application styles
│   ├── index.css                   # Global styles
│   ├── main.tsx                    # Application entry point
│   └── vite-env.d.ts               # Vite environment types
├── public/                         # Public static files
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
├── components.json                 # Component configurations
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package-lock.json               # Locked dependencies
├── package.json                    # Project dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.app.json               # App-specific TypeScript config
├── tsconfig.json                   # Base TypeScript configuration
├── tsconfig.node.json              # Node-specific TypeScript config
├── vite.config.ts                  # Vite configuration
└── README.md                       # Project documentation
```

## Technology Stack

- React.js - Frontend framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Vite - Build tool and development server
- Supabase - Backend and database

## Assumptions and Limitations

- The application requires a modern browser with JavaScript enabled
- File uploads are limited to common document formats
- Local development environment required for running the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
