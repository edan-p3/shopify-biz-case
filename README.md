# Shopify Business Case Platform

A comprehensive business case analysis platform for evaluating Shopify commerce platform migrations. Features interactive financial projections, ROI calculations, risk assessments, and scenario comparisons.

## 🎯 Project Overview

This platform helps businesses build compelling business cases for migrating to Shopify. It includes:

- **Interactive Dashboard**: Real-time financial projections and ROI analysis
- **Scenario Comparison**: Conservative, Moderate, and Aggressive growth scenarios
- **Financial Modeling**: 3-year revenue projections, cash flow analysis, TCO comparison
- **Risk Management**: Comprehensive risk assessment with mitigation strategies
- **Export Capabilities**: PDF, Excel, and JSON exports
- **REST API**: Full-featured backend with financial calculation engine

## 🏗️ Architecture

### Frontend (`/app`)
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deployment**: Vercel

### Backend (`/backend`)
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma
- **Authentication**: JWT
- **Deployment**: Railway / Render / Heroku (traditional server hosting)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 15+ (for backend)
- Redis 7+ (for backend)

### Frontend Setup

```bash
cd app
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manual setup
npm install
docker-compose up -d  # Starts PostgreSQL and Redis
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend runs on `http://localhost:3001`

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed backend setup instructions.

## 📦 Project Structure

```
shopify-biz-case/
├── app/                      # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # React context
│   │   ├── data/             # Business case data
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Calculations & utilities
│   │   └── types/            # TypeScript types
│   ├── prisma/               # Database schema & seeds
│   └── package.json
├── BACKEND_SETUP.md          # Backend setup guide
├── IMPLEMENTATION_COMPLETE.md # Implementation details
└── README.md                 # This file
```

## 🌐 Deployment

### ✨ All-in-One Vercel Deployment (Recommended)

**Your entire platform now runs on Vercel!** Backend refactored to serverless functions.

#### Quick Deploy (5 minutes):

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/shopify-biz-case.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy" (auto-configured!)

3. **Add Vercel Postgres**:
   - In Vercel project → Storage → Create Database → Postgres
   - Auto-configures DATABASE_URL ✨

4. **Set Environment Variables**:
   ```
   JWT_SECRET=your-random-secret
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Run Migrations**:
   ```bash
   vercel env pull .env.local
   cd backend && npx prisma migrate deploy
   ```

✅ **Done!** Your app is live at `https://your-app.vercel.app`

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for detailed step-by-step instructions.

## 📤 Push to GitHub

### Step-by-Step Instructions

1. **Initialize Git** (if not already done):
   ```bash
   cd /Users/edandvora/Documents/shopify-biz-case
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Create first commit**:
   ```bash
   git commit -m "Initial commit: Shopify Business Case Platform

   - Complete React frontend with Tailwind CSS
   - Node.js/Express backend with TypeScript
   - PostgreSQL database with Prisma ORM
   - Redis caching layer
   - Financial calculation engine
   - API with 25+ endpoints
   - Docker support
   - Comprehensive documentation"
   ```

4. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "+" → "New repository"
   - Name: `shopify-biz-case` or your preferred name
   - Description: "Business case analysis platform for Shopify migrations"
   - Choose Public or Private
   - **Don't** initialize with README (we already have one)
   - Click "Create repository"

5. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` and `REPO-NAME` with your actual GitHub username and repository name.

## 🔑 Environment Variables

### Frontend (.env in `/app`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (.env in `/backend`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/shopify_bizcase
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Frontend
```bash
cd app
npm test
```

### Backend
```bash
cd backend
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 📚 API Documentation

The backend provides a comprehensive REST API. See [backend/README.md](./backend/README.md) for complete API documentation.

### Key Endpoints

- `GET /api/health` - Health check
- `GET /api/business-cases` - List business cases
- `POST /api/business-cases` - Create business case
- `GET /api/business-cases/:id` - Get business case details
- `GET /api/business-cases/:id/scenarios/:type` - Get scenario
- `POST /api/business-cases/:id/export` - Generate export

## 🎨 Features

### Financial Analysis
- 3-year revenue projections
- Monthly cash flow analysis (36 months)
- ROI calculations (payback period, NPV, IRR)
- Total Cost of Ownership (TCO) comparison
- Sensitivity analysis
- Scenario comparison

### Business Intelligence
- Current state assessment
- Strategic value proposition
- Risk assessment matrix
- Implementation roadmap (6 phases)
- Industry benchmarks

### User Experience
- Interactive charts and visualizations
- Real-time calculations
- PDF export capability
- Responsive design
- Dark mode support (if implemented)

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- html2canvas + jsPDF
- React Router (if needed)

### Backend
- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Joi (validation)
- Winston (logging)
- Jest (testing)

## 📝 License

ISC

## 👨‍💻 Development

### Code Style
- ESLint for linting
- Prettier for formatting (if configured)
- TypeScript strict mode

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to GitHub: `git push origin feature/your-feature`
4. Create Pull Request

## 🐛 Troubleshooting

### Frontend Issues
- **Port in use**: Change port in `vite.config.ts`
- **Build fails**: Clear `node_modules` and reinstall
- **API not connecting**: Check `VITE_API_URL` in `.env`

### Backend Issues
- **Database connection**: Ensure PostgreSQL is running
- **Redis connection**: Ensure Redis is running
- **Port in use**: Change `PORT` in `.env`

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed troubleshooting.

## 📧 Support

For issues and questions:
1. Check the documentation
2. Review [BACKEND_SETUP.md](./BACKEND_SETUP.md)
3. Check logs: `backend/logs/combined.log`
4. Open an issue on GitHub

## 🙏 Acknowledgments

Built with modern web technologies and best practices for production-ready applications.

---

**Status**: ✅ Production Ready

Built for analyzing and presenting Shopify commerce platform migration business cases.
