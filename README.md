# 🛒 Cartify – Full Stack MERN E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

**Cartify** is a robust e-commerce application built to master the real-world flow of the MERN stack. Developed over 23 days, this project prioritizes backend architecture, secure authentication, and complex state management over simple UI polish.

🔗 **[Live Demo](https://cartify3.netlify.app)** 🔗 **[Portfolio](https://shakportfoilio.netlify.app)**

---

## 🚀 Tech Stack

### Frontend
- **React (Vite):** Fast and modern development environment.
- **Redux Toolkit:** Managing global state for authentication and cart.
- **Responsive UI:** Designed to work seamlessly on Mobile, Tablets, and Desktops.

### Backend
- **Node.js & Express.js:** Scalable server-side logic and RESTful API design.
- **MongoDB:** NoSQL database for flexible data storage.
- **JWT (JSON Web Tokens):** Secure authentication using Access and Refresh tokens.

---

## ✨ Features

### 🛍️ User Features
- **Product Browsing:** Explore Electronics, Clothing, and Grocery products.
- **Optimized UX:** Skeleton loading screens and smooth horizontal scrolling categories.
- **Global Search:** MongoDB-powered search bar with **Debounced input** to optimize API calls.
- **Review System:** Add, edit, or delete reviews (restricted to 1 review per user/product).
- **Cart Management:** Add items to cart with persistent global state.

### 🔐 Auth & Security
- **Secure JWT Flow:** Implementation of Access and Refresh tokens for long-lived sessions.
- **Protected Actions:** Login required for adding to cart, adding addresses, or posting reviews.
- **Account Control:** Users can securely delete their own accounts.

### 🛠️ Admin Panel
- **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality.
- **Admin Protection:** Secure routes accessible only by users with Admin privileges.

---

## 🧠 What I Learned
- **Architecture:** Building a full-stack application from scratch with a scalable folder structure.
- **Auth Flow:** Implementing professional-grade authentication and route protection.
- **State Management:** Using Redux to sync UI changes across different pages (Auth, Cart).
- **Backend Optimization:** Handling search filtering and data fetching efficiently.

> [!NOTE]  
> **Payment gateway integration** was not a priority for this version. The primary focus was on learning the MERN architecture and authentication flows.

---
