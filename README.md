# 🎸 Interactive Musical Instrument Shopping App

Welcome to our **Interactive Musical Instrument Shopping Application**! This app offers innovative features such as **image and sound recognition**, **personalized recommendations**, and a **favorites management system** to enhance your shopping experience. 🎶🛍️

---

## 🚀 Features & Considerations

### 🎯 Predefined Instruments
To facilitate evaluation, some instruments are preloaded into the cart and favorites:

#### 🛒 **Cart**:
- **FENDER PLAYER STRATOCASTER LIMITED CANDY RED BURST HSS PF ELECTRIC GUITAR**
- **FENDER PLAYER STRATOCASTER 3-COLOR SUNBURST MN HSS ELECTRIC GUITAR**
- **MARSHALL MG15G**
- **RODE NT1-A COMPLETE VOCAL RECORDING**
- **TAYLOR SWIFT 614ce SPECIAL EDITION ACOUSTIC ELECTRIC GUITAR - RED**

#### ❤️ **Favorites**:
- **FENDER PLAYER STRATOCASTER LIMITED CANDY RED BURST HSS PF ELECTRIC GUITAR**
- **FENDER PLAYER STRATOCASTER 3-COLOR SUNBURST MN HSS ELECTRIC GUITAR**

### 🔍 Detected Instruments
The application can detect the following instruments through:
- **Image scanning**: 🖼️ Black Flute, Red Drum
- **Sound detection**: 🎵 Black Flute

### 🛍️ Purchase Process
- When processing a purchase, **the cart is reset**.
- Only instruments **detected by the application** can be added to the cart.

### 🎵 Song Recommendations
- Displayed for **40 seconds** (estimated purchase process time).
- To save recommendations, you must **share them**.

### 🚨 Empty Cart Warning
- If the cart is empty, the application will display an **error message for 40 seconds** (evaluation time).

---

## 📝 Instructions for Use

### ➕ **Add to Cart**
- Press the **"IMAGE"** button to scan an instrument.
- **Turn the screen right** to add it to the cart.
- **Turn the screen left** to reject it.

### ⭐ **Add to Favorites**
- Press the **"SOUND"** button to recognize the instrument being played.
- **Shake the phone up and down** to add it to favorites.

### 🗑️ **Delete Instruments**
- Press the **trash can** icon.
- **Tilt the phone down repeatedly** to select the instrument.
- Press the **trash can** icon again to delete it (works for both cart and favorites).

### 🔢 **Sort the Cart**
- Press the **microphone** button and say:
  - "sort from least to most"
  - "sort from smallest to largest"
  - "sort from most to least"
  - "sort from largest to smallest"

### 💳 **Process a Purchase**
- Press the **microphone** icon and say:
  - "buy" or "pay"
- A pop-up will appear with **song recommendations** based on the instruments in your cart.
- You can **share these recommendations** via email.
- **The cart will be emptied** after the purchase.

### 👀 **View Favorites/Cart**
- Press the **microphone** and say:
  - "view favorites", "view my favorites", or "favorites" to see your favorite instruments.
  - "view my cart", "cart", or "view cart" to return to the cart.

### ❓ **Help**
- Press the **help button "?"** to view these instructions.

### 📍 **Store Location**
- Press the **location icon** to use your location and display the nearest music stores.

---

## 🛠️ How to Start the Application

1. Open the code in a **code editor** (we recommend **Visual Studio Code**).
2. Open the terminal and run:
   ```bash
   node index.js
   ```
   to start the server.
3. Open the payment screen in **Google Chrome**:
   ```
   http://localhost:3000
   ```
4. Connect your **mobile phone to the computer via USB** and enable **USB debugging**.
5. Open the **QR code scanner** and scan the code on the payment screen.
6. The path:
   ```
   http://localhost:3000/cliente/index.html
   ```
   will open directly on your mobile device.

---

## 👥 Team Members
- Martin Portugal
- Aitana Ortiz
- Alba Vidales

---

## 📂 Code Organization
The code is organized into the following folders:

- **Pruebas_camara_recon.js**: Functional code for image recognition using Teachable Machine.
- **package-lock.json / package.json**: Contains all dependencies and version logs related to Node.js, ensuring that all team members use the same versions.
- **index.js**: Defines a web server using Node.js with Express.js and Socket.io, enabling real-time communication between a client (likely a mobile application) and a web-based UI (probably the payment screen on a desktop browser).
- **node_modules/**: Stores all JavaScript packages required by the project, along with their dependencies.
- **www/**: Implementation of the client and payment screen.
  - **cliente/**: Client implementation.
    - **index.html**: Client layout.
    - **script.js**: Client functionality.
    - **style.css**: Client styling.
  - **data/**: JSON files containing instrument information for the payment screen.
  - **images/**: Contains images used in the payment screen.
  - **index.html**: Payment screen layout.
  - **script.js**: Payment screen functionality.
  - **style.css**: Payment screen styling.

---

🎵 *Enjoy your musical shopping experience!* 🛍️🎸

