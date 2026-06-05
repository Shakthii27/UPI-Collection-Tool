## Overview

A full-stack UPI Collection Tool built using React.js, Node.js, Express.js, MongoDB Atlas, and JWT Authentication. The application allows users to register, log in, generate UPI payment collection links, track payment history, and receive payment status updates through callback APIs.

## Features
- User Registration and Login
- JWT Authentication
- UPI Payment Link Generation
- Payment History Tracking
- Callback API for Payment Status Updates
- Validation and Error Handling
- MongoDB Cloud Database Integration

## Tech Stack
- Frontend: React.js, Axios, Tailwind CSS
- Backend: Node.js, Express.js, JWT, MongoDB Atlas
- Third Party: Bulkpe UPI Collection API


## Bulkpe Integration
The application is designed to work with the Bulkpe payment system for creating UPI payment requests and tracking their status.
Whenever a payment request is generated, a unique reference ID is created and stored along with the transaction details. The system also includes a callback endpoint that updates the payment status and reflects the changes in the dashboard and payment history.  
Since the BulkPe API currently returns an access restriction error, the application workflow and callback functionality were implemented and verified independently.
