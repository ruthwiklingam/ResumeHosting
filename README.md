# Resume Hosting Application

A full-stack resume hosting application built with React, Node.js, MySQL, and Docker.

## 🚀 Features

- **Modern React Frontend**: Beautiful, responsive UI with animations and modern design
- **RESTful API Backend**: Node.js/Express API with comprehensive endpoints
- **MySQL Database**: Structured data storage for resume information
- **Docker Integration**: Complete containerized setup with Docker Compose
- **Professional Design**: Clean, modern layout optimized for viewing and printing
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **PDF Download**: Generate and download professional PDF versions of the resume

## 🏗️ Architecture

```
├── frontend/          # React application
├── backend/           # Node.js API server
├── database/          # MySQL initialization scripts
└── docker-compose.yml # Multi-container orchestration
```

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd resumehosting
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MySQL: localhost:3306

## 🛠️ Development

### Running Locally

**Backend Development:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Development:**
```bash
cd frontend
npm install
npm start
```

**Database:**
```bash
docker-compose up mysql -d
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=resume_db
DB_USER=resume_user
DB_PASSWORD=resume_password
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ Database Schema

The application uses a comprehensive MySQL schema with the following tables:

- `personal_info` - Basic contact and personal information
- `experience` - Work experience entries
- `job_duties` - Detailed responsibilities for each position
- `education` - Educational background
- `skills` - Technical and soft skills with proficiency levels
- `projects` - Personal and professional projects
- `certifications` - Professional certifications and credentials

## 🔗 API Endpoints

### Core Endpoints
- `GET /api/resume` - Complete resume data
- `GET /api/resume/pdf` - Download PDF version of resume
- `GET /api/personal-info` - Personal information
- `GET /api/experience` - Work experience with duties
- `GET /api/education` - Educational background
- `GET /api/skills` - Skills grouped by category
- `GET /api/projects` - Projects portfolio
- `GET /api/certifications` - Professional certifications
- `GET /api/health` - Health check endpoint

### Individual Experience
- `GET /api/experience/:id` - Specific work experience

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Modular React components
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages with retry functionality
- **Modern Icons**: React Icons integration
- **Print Optimization**: CSS optimized for printing resumes
- **PDF Download**: One-click PDF generation and download
- **Accessibility**: WCAG compliant design patterns

## 🔒 Security Features

- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet.js**: Security headers middleware
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation with Joi
- **SQL Injection Prevention**: Parameterized queries
- **Docker Security**: Non-root user containers

## 🐳 Docker Configuration

The application uses multi-stage Docker builds and includes:

- **MySQL 8.0**: Database with initialization scripts
- **Node.js Alpine**: Lightweight backend container
- **Nginx Alpine**: Optimized frontend serving
- **Health Checks**: Container health monitoring
- **Volume Persistence**: Database data persistence
- **Network Isolation**: Secure internal networking

## 📊 Performance Optimizations

- **Connection Pooling**: MySQL connection pooling
- **Gzip Compression**: Nginx gzip compression
- **Static Asset Caching**: Long-term caching headers
- **Lazy Loading**: Component-level code splitting
- **Image Optimization**: Optimized asset delivery

## 🚀 Deployment

### Production Deployment

1. **Update environment variables for production**
2. **Build and deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Azure Deployment

This application is designed to be easily deployable to Azure using:
- Azure Container Instances
- Azure Database for MySQL
- Azure Container Registry

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🛟 Support

For support, please open an issue on GitHub or contact [your-email@example.com].

---

Built with ❤️ using React, Node.js, MySQL, and Docker.
