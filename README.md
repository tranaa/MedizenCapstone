## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Please have the following installed:

* node version 12 or higher. Check with:
  ```sh
  node -v
  ```

* npm
  ```sh
  npm install npm@latest -g
  ```

* expo-cli
  ```sh
  npm i -g expo-cli
  ```

### Installation

1. Clone the repo (if you have code already skip this step)
   ```sh
   git clone https://github.com/tranaa/MedizenCapstone.git
   ```
2. Navigate to root directory of project install NPM packages
   ```sh
   npm install
   ```
3. Create env refer to firebase/env steps below
4. Start expo project
   ```sh
   npm start
   ```
   or 
   ```sh
   expo start
   ```
5. Run application
   1. Once expo has started a console will open in your browser
   2. you can launch the project multiple ways
   3. easiest is web browser (notifications will not work)
   4. Steps for ios simulator https://docs.expo.dev/workflow/android-studio-emulator/
   5. Steps for android simulator https://docs.expo.dev/workflow/ios-simulator/
   6. Install expo app on mobile device and scan QR code

### Firebase/Environment setup
1. Create a Google Firebase account
2. Go to your console via clicking console or get started (https://console.firebase.google.com/)
3. Add project with desired name
4. Add a web application to the project
5. Register the app with a nickname
6. Add Firebase to the project copy content of firebaseConfig object
   ![env variables to copy](https://i.imgur.com/xx1CFjf.png)
7. Create an `.env` file at the root of the project directory
8. Paste the content of firebaseConfig object in this format without quotes for string
   ```API_KEY= 
   AUTH_DOMAIN= 
   PROJECT_ID= 
   STORAGE_BUCKET= 
   MESSENGING_SENDER_ID= 
   APP_ID=
   ```
9. Click continue to console in Firebase
10. On the left side of screen click Authentication
11. Select sign-in method and add/enable email/password as providers
12. On the left side of screen click Storage
13. Click get started
14. complete the setup confirm the default
15. Create a folder called medications
