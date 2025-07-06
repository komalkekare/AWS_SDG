# Synthetic Data Generation with React
Synthetic data generation in React involves creating artificial data that mimics real-world datasets, helping developers test and develop applications without relying on sensitive or real data. By using various models, libraries, and validation techniques, it enables simulation of different scenarios while ensuring data privacy and efficiency in development. Leveraging hooks and state management using React streamlines the process of simulating various use-cases while maintaining application performance.

# What is Synthetic Data Generation?
This project leverages GenAI technologies to generate synthetic data from diverse sources like BigQuery, Firestore, CloudSQL, and CSV/JSON files. The solution provides configuration details for secure authentication, enabling seamless integration with various data sources. Users can obtain schemas to identify sensitive and unique fields for data masking and redundancy management, ensuring privacy and data integrity throughout the process.

A robust Data Loss Prevention (DLP) mechanism is employed to mask sensitive data and prevent redundancy. Users can selectively choose the fields to be masked, protecting personal and confidential information. The system ensures unique values for fields marked for redundancy, avoiding duplication while preserving data integrity without compromising security.

Synthetic data generation is powered by Gemini AI for small-scale datasets, with users able to specify row counts. The process includes comprehensive validation metrics that psuch as data success rate, total validations, and any failed validations to ensure high-quality generated data. For larger datasets, the solution employs CTGAN (Conditional Generative Adversarial Networks) to generate high-fidelity data at scale.

Once data is generated and validated, it is pushed back to the respective data sources for further use. The solution also includes a tabular view for users to examine the generated data by CTGAN model. This approach ensures flexibility, scalability, and privacy while delivering realistic synthetic data for testing, development, and machine learning applications.

# Getting Started with React: Installation and Setup

### 1. Download and install Node.js and npm(Node Package Manager) from the link below:
[Node.js] (https://nodejs.org/en)

### 2. Verify the node version in the command prompt
node -v

npm -v

# Architecture Diagram

<img width="576" alt="image" src="https://github.com/user-attachments/assets/eb19fc9c-783e-49c8-b8df-c5e86adb0af1" />


### 3. Key Commands
i. Install create-react-app

    npm install -g create-react-app

ii. Create a new React app

    npx create-react-app my-app

iii. Start the development server

     npm start

iv. Build the app for production

    npm run build

# React References:-
* [Quick Start with React] (https://react.dev/learn)

* [Styling Components with MUI] (https://mui.com/material-ui/getting-started)
