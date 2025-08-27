# Real-Time Bus Tracking System

A comprehensive bus tracking system for the National Transport Commission of Sri Lanka, featuring a RESTful API backend and modern React frontend.

## 🚀 Features

### Backend (Node.js/Express)
- **RESTful API** with ES6+ JavaScript
- **JWT Authentication** with role-based access control
- **Real-time updates** via Server-Sent Events
- **Comprehensive validation** using Joi
- **Rate limiting** and security middleware
- **Swagger/OpenAPI documentation**
- **JSON-based data storage**
- **Analytics and health monitoring**

### Frontend (React/TypeScript)
- **Modern React 18** with TypeScript
- **Real-time dashboard** with live bus tracking
- **Responsive design** with Tailwind CSS
- **Role-based UI** (Admin, Operator, Viewer)
- **Interactive maps** and data visualization
- **Form validation** and error handling

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bus-tracking-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp "Web API/.env.example" "Web API/.env"
   
   # Edit the .env file with your configuration
   # JWT_SECRET=your-secret-key
   # PORT=3000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

## 🚀 Development

### Start both frontend and backend
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:3000/docs

### Start individually
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## 🏗️ Building for Production

### Build both applications
```bash
npm run build
```

### Build individually
```bash
# Backend
npm run build:backend

# Frontend
npm run build:frontend
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run individually
```bash
# Backend tests
npm run test:backend

# Frontend linting
npm run test:frontend
```

## 📁 Project Structure

```
bus-tracking-system/
├── Web API/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utilities
│   ├── data/                # JSON data files
│   └── tests/               # API tests
├── client/                  # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # API client, utilities
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
└── package.json             # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Routes
- `GET /routes` - List all routes
- `GET /routes/:id` - Get specific route
- `POST /routes` - Create new route
- `PUT /routes/:id` - Update route
- `DELETE /routes/:id` - Delete route

### Buses
- `GET /buses` - List all buses
- `GET /buses/:id` - Get specific bus
- `POST /buses` - Create new bus
- `PUT /buses/:id` - Update bus
- `DELETE /buses/:id` - Delete bus
- `GET /buses/:id/locations` - Get bus GPS history

### Trips
- `GET /trips` - List all trips
- `GET /trips/:id` - Get specific trip
- `POST /trips` - Create new trip
- `PUT /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip

### Health & Analytics
- `GET /health` - System health check
- `GET /analytics` - System analytics
- `GET /realtime` - Real-time updates (SSE)

## 🔐 Authentication

The system uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin**: Full access to all features
- **Operator**: Can manage buses, routes, and trips
- **Viewer**: Read-only access to data

## 🌐 Deployment

### Backend Deployment
1. Set environment variables
2. Run `npm run build`
3. Start with `npm start`

### Frontend Deployment
1. Run `npm run build`
2. Serve the `dist` folder
3. Configure API proxy or CORS

### Environment Variables
```env
# Backend (.env)
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production

# Frontend (vite.config.ts)
VITE_API_URL=http://localhost:3000
```

## 📊 Monitoring

- **Health Check**: `/health` endpoint
- **API Documentation**: `/docs` (Swagger UI)
- **Real-time Monitoring**: Dashboard analytics
- **Error Logging**: Winston logger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the test files for usage examples
- Open an issue on GitHub
