# DO-GOOD-done

Do good volunteering app is a platform where people in need can place their request of help and its details and volunteers who can see that list of tasks in their local and willing to provide help in their free time.

The tools used to implement this project and provide a feature rich experience are:
FrontEnd —— ReactJS
BackEnd ——express NodeJS
Database —— MonogoDB Atlas

## Getting Started with Create React App and Pre-requirements

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`Do-Good App` has two parts: frontend and backend.

To be able running and testing Do-Good App locally it's required to have `npm` installed in the system.
The easiest way to install `npm` is by doing so via `brew` through the Terminal.

Open Terminal and type the command to install the `brew`

# `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

After installing check updates by using the command below

# `brew update`

Install `npm` through `brew` by using the command below

# `brew install node`

Test `npm` and `node` by using the commands below

# `npm -v`

# `node -v`

If versions received in return `node` and `npm` installed correctly.

## Running FrontEnd

To run the frontend open Terminal and go to the `client` folder in Do-Good App parent folder:

# `cd client`

Then run the frontend:

# `npm run start:frontend`

Runs the app's frontend in the development mode.\
If not opened automatically, open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Technology used in frontend:
"axios": "^0.26.1", Promise based HTTP client for the browser and node.js
"bootstrap": "^5.1.3", Bootstrap is a powerful, feature-packed frontend toolkit.
"bootstrap-icons": "^1.8.1", icons for bootstrap
"formik": "^2.2.9", is a small group of React components and hooks
"react": "^17.0.2", a JavaScript library for building user interfaces
"react-bootstrap-icons": "^1.8.2",
"react-cookie": "^4.1.1", for implementing cookie
"react-dom": "^17.0.2", package serves as the entry point to the DOM and server renderers for React.
"react-router-dom": "^6.2.2", is a fully-featured client and server-side routing library for React
"react-scripts": "5.0.0", Configuration and scripts for Create React App
"react-tinder-card": "^1.4.5", card with swiping
"web-vitals": "^2.1.4", The Core Web Vitals report shows how your pages perform, based on real world usage data
"workbox-background-sync": "^6.5.3", service worker
"yup": "^0.32.11" Dead simple Object schema validation.

## Running BackEnd

To run the backend open Terminal and go to the `server` folder in Do-Good App parent folder:

# `cd server`

Then run the backend:

# `npm run start:backend`

Runs the app's backend in the development mode [http://localhost:8080](http://localhost:8080)

Technology used in backend:
"alert": "^5.0.12", for alert popups
"bcrypt": "^5.0.1", for hashing password
"body-parser": "^1.20.0", Parse incoming request bodies in a middleware before your handlers
"cookie-parser": "^1.4.6", Parse Cookie header and populate req.cookies with an object keyed by the cookie names
"cors": "^2.8.5", for Cross-Origin Resource Sharing
"dotenv": "^16.0.0", Loads environment variables from .env file
"express": "^4.17.3", for reading json
"express-ipfilter": "^1.2.0", for allowed IP adress
"express-rate-limit": "^6.4.0", for allowing requests per time
"express-session": "^1.17.3", for using sessions
"express-slow-down": "^1.4.0",
"helmet": "^5.1.0", for protect middleware
"http-status-codes": "^2.2.0", for indication whether a specific HTTP request has been successfully completed
"ip-whitelist": "^1.2.2", for ip whitelist
"jsonwebtoken": "^8.5.1", for generating unique web token
"mongodb": "^4.4.1", for Mongo connection
"mongoose": "^6.3.3", provides a straight-forward, schema-based solution to model Mongo DB.
"morgan": "^1.10.0", middleware
"nodemon": "^2.0.15",Simple monitor script for use during development of a Node.js app
"uuid": "^8.3.2", for generating unique user id
"workbox-broadcast-update": "^6.5.3", service worker

## Running Admin Panel

To run the frontend open Terminal and go to the `admin` folder in Do-Good App parent folder:

# `cd admin`

Then run the frontend:

# `npm run start:admin`

Runs the app's frontend in the development mode.\
If not opened automatically, open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Technology used in admin:
"axios": "^0.26.1", Promise based HTTP client for the browser and node.js
"bootstrap": "^5.1.3", Bootstrap is a powerful, feature-packed frontend toolkit.
"bootstrap-icons": "^1.8.1", icons for bootstrap
"formik": "^2.2.9", is a small group of React components and hooks
"react": "^17.0.2", a JavaScript library for building user interfaces
"react-bootstrap-icons": "^1.8.2",
"react-cookie": "^4.1.1", for implementing cookie
"react-dom": "^17.0.2", package serves as the entry point to the DOM and server renderers for React.
"react-router-dom": "^6.2.2", is a fully-featured client and server-side routing library for React
"react-scripts": "5.0.0", Configuration and scripts for Create React App
"react-tinder-card": "^1.4.5", card with swiping
"web-vitals": "^2.1.4", The Core Web Vitals report shows how your pages perform, based on real world usage data
"workbox-background-sync": "^6.5.3", service worker
"workbox-cacheable-response": "^6.5.3", service worker
"yup": "^0.32.11" Dead simple Object schema validation.

## Resolving crossplatform issues in development mode

Do-Good App uses `bcrypt` node component and it's platform dependant ans being developed to be crossplatform currently.
In case of having issues with starting backend due to incompatible architecture and code `ERR_DLOPEN_FAILED` appears it's required to reinstall `bcrypt`

Uninstall current `bcrypt` component.

Go to `server` folder if elsewhere

# `cd server`

Uninstall current `bcrypt` component

# `npm uninstall bcrypt`

Install `brypt` component

# `npm install bcrypt`

`bcrypt` component will be installed as per used platform automatically.

Run backend server for testing

# `nom run start:backend`
