# ETSM Frontend

ETSM Frontend is a **_React_** + **_TypeScript_** application built with **_Vite_**.

- App using two popular CSS frameworks for UI custom and component reuse is **_TailwindCSS_** and **_Material_**.

- Also using supportive libraries like **_React Router_** for page routing, **_Tanstack Query_** and **_Axios_** for API calls, **_Frame Motion_** for UX, **_Socket.io Client_** for real-time chat.

## Project Structure

```
etsm_frontend/
  public/                Static assets served as-is
  src/
    assets/              Images and shared static assets
    components/          Reusable UI and feature components
      confirmation/      Confirmation flow components
      dashboard/         Dashboard layout and feature components
      login/             Login flow components
    constants/           Enums and app constants
    pages/               Route-level page components
    routes/              Route definitions and navigation
    services/            API clients and DTOs
      apis/              API wrappers (auth, task, user)
      dto/               TypeScript DTOs for API data
    styles/              Shared styling and theme assets
    App.tsx              App root component
    main.tsx             Entry point and app bootstrap
    index.css            Global styles
  index.html             HTML template
  vite.config.ts         Vite configuration
  tsconfig*.json         TypeScript configuration
  eslint.config.js       ESLint configuration
```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

Vite will print the local URL in the terminal (typically http://localhost:5173).

# Screenshots

## Role Selection

![Role Selection Page](./public/screenshots/roleSelection.png)

## Owner

### Phone number Form

![Phone number Form](./public/screenshots/manager/owner1.png)

### OTP Validation Form

![OTP Validation Form](./public/screenshots/manager/owner2.png)

### Success Login Page

![Success Login Page](./public/screenshots/manager/owner3.png)

### Employee Management Tab

![Employee Management Tab](./public/screenshots/manager/owner4.png)

### Employee Work Schedule Management Tab

![Employee Work Schedule Management Tab](./public/screenshots/manager/owner5.png)

### Task Management Tab

![Task Management Tab](./public/screenshots/manager/owner6.png)

### Chat Tab

![Chat Tab](./public/screenshots/manager/owner7.png)

### Chat Box

![Chat Box](./public/screenshots/manager/owner8.png)

### User Profile Tab

![User Profile Tab](./public/screenshots/manager/owner9.png)

## Employee

### Login Method Selection Page

![Login Method Selection Page](./public/screenshots/employee/employee1.png)

### Credential Login Page

![Credential Login Page](./public/screenshots/employee/employee2.png)

### Email Login Form

![Email Login Form](./public/screenshots/employee/employee3.png)

### Employee Dashboard Page

![Login Method Selection Page](./public/screenshots/employee/employee4.png)
