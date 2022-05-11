Volunteering is a great way to give back to your community. The JK app makes it easier than ever to get involved. The idea behind the app-only service to remove the barriers that often put people off giving up their time by automating as much as possible.
DO GOOD app is a platform where people in need can place their request for need of help and its details and volunteers who can see that list of tasks in their local and willing to provide help in their free time.

The tools used to implement this project and provide a feature rich experience
are:
FrontEnd —— React JS
BackEnd —— express Node JS
Database —— Atlas MonogoDB

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

## Running BackEnd

To run the backend open Terminal and go to the `server` folder in Do-Good App parent folder:

# `cd server`

Then run the backend:

# `npm run start:backend`

Runs the app's backend in the development mode [http://localhost:8000](http://localhost:8000)

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
