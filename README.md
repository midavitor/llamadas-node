# Llamadas Node

## Overview
Llamadas Node is a Node.js application that utilizes the Twilio API to make phone calls programmatically. This project serves as a simple example of how to integrate Twilio's communication services into a Node.js application.

## Features
- Make phone calls to specified numbers.
- Retrieve the status of ongoing calls.

## Prerequisites
- Node.js installed on your machine.
- A Twilio account with an active phone number.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd llamadas-node
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Configuration
Before running the application, you need to set up your Twilio credentials. Create a `.env` file in the root directory of the project and add the following variables:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Usage
To make a call, run the following command:
```
node src/index.js <recipient_phone_number>
```

To check the status of a call, you can modify the `index.js` file to include the call SID and call the `getCallStatus` method.

## License
This project is licensed under the MIT License.