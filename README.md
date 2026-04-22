# Kitapsepeti.com E-Commerce QA Automation Project

This repository contains automated end-to-end (E2E) tests for the **Kitapsepeti.com** e-commerce platform. The project focuses on validating critical user paths like authentication and product search using modern testing tools and best practices.

## 🎯 Project Overview
The main goal of this project is to ensure the stability of core e-commerce functionalities. It addresses common web automation challenges such as dynamic pop-ups, asynchronous loading, and complex navigation structures by implementing a robust and maintainable framework.

## 🛠️ Tech Stack & Architecture
- **Framework:** Cypress (v13+)
- **Language:** JavaScript (ES6+)
- **Design Pattern:** Page Object Model (POM)
- **Methodology:** BDD (Behavior Driven Development) using Cucumber/Gherkin
- **CI/CD:** GitHub Actions (Node.js v22)
- **Reporting:** Mochawesome (HTML reports with embedded results)

## 📁 Project Structure
The project follows a modular structure for better maintainability:

*   `cypress/e2e/features/`: Gherkin feature files defining the test scenarios.
*   `cypress/e2e/Step-Definitions/`: JavaScript files mapping Gherkin steps to logic.
*   `cypress/pages/`: Page Object classes containing locators and methods.
*   `cypress/reports/`: Generated HTML test reports.
*   `.github/workflows/`: CI/CD pipeline configuration.

## 🚀 Tested Scenarios
Currently, **10 high-priority test cases** are automated across two main suites:

### 1. TS01 - Authentication (Login)
- Positive login with valid credentials.
- Negative scenarios (invalid email, wrong password, null values).
- Validation of the Login UI components.

### 2. TS02 - Search & Listing
- Successful product search and result verification.
- UI reset logic (clearing the search bar).
- Product card integrity (Image, Title, Price checks).
- Category navigation and sorting functionality.

## 🔧 Setup and Execution

### Prerequisites
- Node.js (Version 22 recommended)
- npm

### Installation
1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Tests
- **To open Cypress Test Runner (UI):**
  ```bash
  npx cypress open
  ```
- **To run tests in headless mode and generate reports:**
  ```bash
  npx cypress run
  ```

## ⚓ CI/CD Integration
The project is integrated with **GitHub Actions**. The pipeline is triggered on every `push` and `pull_request` to the `main` branch. It ensures:
- Environment consistency using Node v22.
- Secure handling of sensitive data (Credentials, API keys) via GitHub Secrets.
- Artifact management (Videos and Screenshots are saved for failed tests).

## 📊 Reporting
Test results are recorded using **Mochawesome**. After running `npx cypress run`, a comprehensive HTML report is generated in the `cypress/reports/html` directory, providing a visual overview of test status and execution details.
