# Friend CRM
CRM for founders. Listens to your conversations using the Friend AI wearable, then generates CRM data & outreach emails to follow-up with potential customers. 

<img width="1425" alt="image" src="https://github.com/user-attachments/assets/0ea4d03a-f884-4859-a800-5f50a869e7b7">

## Built With
- [Friend AI wearable](https://basedhardware.com/)
- React 
- Node.js & Express
- Firestore 

# Steps to Run

1. **Install dependencies:**
   - Run `npm install` in the root directory
   - Run `npm install` in the `client` directory
   - Run `npm install` in the `server` directory

2. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add your Anthropic API key: `ANTHROPIC_API_KEY=your_api_key_here`

3. **Start the application:**
   - To run the frontend locally, navigate to the `client` directory and run `npm start`
   - Set up ngrok:
     - Install ngrok if you haven't already
     - Start an ngrok temporary server to expose your local server

4. **Configure the Friend/Based Hardware app:**
   - Download the Friend/Based Hardware app
   - Enter development mode in the app
   - Add the ngrok endpoint URL to trigger on memory creation
   - Append this to the ngrok URL: `crm/nXOwh9aZ37ygyVwkD0JZ/vTPA2NtEwrhVeuqyQUtP`
   - The full endpoint should look like: `https://your-ngrok-url.ngrok.io/crm/nXOwh9aZ37ygyVwkD0JZ/vTPA2NtEwrhVeuqyQUtP`

5. **Using the application:**
   - When a new memory is added in the Friend app, it will automatically add that conversation to the CRM
   - Note: The CRM is currently shared among all users as there is no authentication implemented yet

# Next Steps
- [ ] Add authentication so each user can create their own CRM instance
- [ ] Add the ability to enter your own API keys
- [ ] Share as public Plugin on [Friend's](https://github.com/BasedHardware/Omi) GitHub
- [ ] Improve email quality & create drafts in your email client
- [ ] Populate CRM with additional details about customer automatically
