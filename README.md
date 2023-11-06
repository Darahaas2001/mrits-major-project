# WhatsApp Chatbot

Welcome to the WhatsApp Chatbot for college management! This README provides instructions on how to set up and run the project effectively.

## Prerequisites

Before you get started, make sure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (version 1.20 or higher)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Darahaas2001/mrits-major-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mrits-major-project
   ```

3. Install project dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Create a `config.env` file in the project root directory and set the following environment variable:

   ```env
   DATABASE_URL=your_database_connection_url
   ```

   Replace `your_database_connection_url` with your actual database connection URL.

5. Open the `index.ts` file and ensure that the `DATABASE_URL` environment variable is set correctly as well.

6. Start the project using the following command:

   ```bash
   yarn start
   ```

7. Wait for a few moments while the automation starts. Users will need to scan the generated QR code to access the chatbot.

## Additional Configuration

Feel free to explore the `config.env` file to customize other settings and configurations as needed for your specific use case.

If you encounter any issues or have questions, please refer to the project's issue tracker on GitHub for support or to report problems.
