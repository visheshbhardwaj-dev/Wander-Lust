WanderLust 🌍

WanderLust is a full-stack web application that allows users to explore, create, and manage travel listings. Users can sign up, log in, add destinations, upload images, and leave reviews.

This project is built using the MERN stack principles with server-side rendering and authentication.

🚀 Features

User authentication (Sign up / Login / Logout)

Create, edit, and delete travel listings

Upload images for listings

Add and delete reviews

Flash messages for user feedback

Secure session management

Environment variable configuration for sensitive data

🛠️ Tech Stack

Frontend

HTML

CSS

JavaScript

EJS (Embedded JavaScript Templates)

Bootstrap

Backend

Node.js

Express.js

Database

MongoDB

Mongoose

Authentication & Security

Passport.js

Express-session

MongoDB session store

📂 Project Structure
Wanderlust/
│
├── models/          # Mongoose models
├── routes/          # Express route handlers
├── views/           # EJS templates
├── public/          # Static assets (CSS, JS, images)
├── utils/           # Utility functions
├── middleware.js    # Custom middleware
├── app.js           # Main server file
└── .env             # Environment variables (not committed)

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/visheshbhardwaj-dev/Wander-Lust.git
cd Wander-Lust


Install dependencies:

npm install


Create a .env file in the root directory and add:

MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret


Start the server:

node app.js


or (if using nodemon)

nodemon app.js


Open in browser:

http://localhost:3000

🔐 Environment Variables

Sensitive credentials are stored in a .env file and are not pushed to GitHub. Make sure .env is included in .gitignore.



📌 Future Improvements

Pagination for listings

Search & filter functionality

User profile dashboard

Wishlist feature

Deployment to a cloud platform

📄 License

This project is for educational purposes.
