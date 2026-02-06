# Development Setup Guide

## Quick Start

To test the services and run the project locally, you need to serve it through a local web server (not `file://` protocol) due to CORS restrictions.

## Option 1: Using Python (Simplest)

### If you have Python 3:
```bash
# Navigate to project directory
cd /Users/rohitkardani/Desktop/Project/Projects/RohitKardani/e-commerce

# Start server
python3 -m http.server 8000
```

### If you have Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

---

## Option 2: Using Node.js

### Install http-server globally:
```bash
npm install -g http-server
```

### Run server:
```bash
cd /Users/rohitkardani/Desktop/Project/Projects/RohitKardani/e-commerce
http-server -p 8000
```

Then open: **http://localhost:8000**

---

## Option 3: Using VS Code Live Server (Recommended for Development)

1. **Install Extension**: Search for "Live Server" by Ritwick Dey in VS Code Extensions
2. **Open Project**: Open the e-commerce folder in VS Code
3. **Start Server**: Right-click on `index.html` → "Open with Live Server"
4. **Auto-refresh**: Code changes automatically refresh the browser!

---

## Testing the Services

Once your server is running:

1. **Test Services**: Open `http://localhost:8000/test-services.html`
2. **Main Site**: Open `http://localhost:8000/index.html`
3. **Cart Page**: Open `http://localhost:8000/cart.html`

### What to Test:
- ✅ Product Service (Get All Products, Get Categories, Search)
- ✅ Auth Service (Send OTP, Verify OTP, Login/Logout)
- ✅ Cart Service (Add to Cart, Update Quantity, Calculate Total)
- ✅ Wishlist Service (Add/Remove, Move to Cart)
- ✅ Order Service (Get Orders, Create Order, Get Stats)

---

## Why Do We Need a Server?

Modern browsers block `fetch()` requests to local JSON files when using the `file://` protocol for security reasons (CORS policy). A local web server serves files over HTTP, which allows `fetch()` to work correctly.

---

## Current Project Structure

```
e-commerce/
├── data/               ← JSON mock data
│   ├── products.json
│   ├── categories.json
│   ├── users.json
│   └── orders.json
├── js/
│   ├── services/       ← NEW: Service layer
│   │   ├── api.service.js
│   │   ├── product.service.js
│   │   ├── auth.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   └── order.service.js
│   ├── config/
│   └── utils/
├── index.html
├── cart.html
├── test-services.html  ← NEW: Service testing page
└── ... other pages
```

---

## Next Steps

After starting the server:
1. Test all services using `test-services.html`
2. Verify existing pages still work
3. Begin migrating existing code to use services instead of direct localStorage
4. Extract components in Phase 1.2

---

## Troubleshooting

### Port Already in Use
If port 8000 is busy, use a different port:
```bash
python3 -m http.server 3000
# Then open http://localhost:3000
```

### Cannot Find Python/Node
- **macOS/Linux**: Python is usually pre-installed. Check with `python3 --version`
- **Windows**: Install Python from python.org
- **All**: Use VS Code Live Server extension instead!

### CORS Errors Persist
Make sure you're accessing via `http://localhost:XXXX` and not `file://`. Check the URL bar.
