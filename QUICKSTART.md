# 🚀 Resume Hosting Application - Quick Start Guide

A modern, full-stack resume application with React frontend, Node.js API, and MySQL database, all containerized with Docker.

## ✨ What You Get

- **Beautiful React Frontend**: Modern, responsive resume display with smooth animations
- **RESTful API Backend**: Professional Node.js API serving resume data
- **MySQL Database**: Structured storage for all resume information
- **Docker Setup**: Complete containerized environment
- **Mobile Responsive**: Looks great on all devices
- **Download Options**: Export your resume as Word document

## 🏁 Quick Start (3 steps!)

### 1. Prerequisites
Make sure you have Docker installed:
- [Download Docker Desktop](https://docs.docker.com/get-docker/)

### 2. Start the Application
```bash
cd /Users/rling3/Desktop/Projects/resumehosting
./start.sh
```

Or manually with Docker Compose:
```bash
docker-compose up -d
```

### 3. View Your Resume
- **Resume Website**: http://localhost:3000
- **API**: http://localhost:5000/api/resume
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure
```
resumehosting/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API calls
│   │   └── App.js         # Main app
│   ├── Dockerfile
│   └── package.json
├── backend/           # Node.js API
│   ├── server.js          # Express server
│   ├── Dockerfile
│   └── package.json
├── database/          # MySQL setup
│   └── init.sql           # Database schema & sample data
├── docker-compose.yml     # Container orchestration
└── start.sh              # Easy startup script
```

## 🛠️ Development

### Local Development
```bash
# Backend only
cd backend && npm install && npm run dev

# Frontend only  
cd frontend && npm install && npm start

# Database only
docker-compose up mysql -d
```

### Using Development Mode
```bash
# Hot reload for both frontend and backend
docker-compose -f docker-compose.dev.yml up
```

## 🎨 Customizing Your Resume

### 1. Update Personal Information
Edit the database initialization script:
```sql
-- In database/init.sql
INSERT INTO personal_info (first_name, last_name, email, ...) VALUES
('Your Name', 'Last Name', 'your@email.com', ...);
```

### 2. Add Your Experience
```sql
-- Add your work experience
INSERT INTO experience (company_name, position, start_date, ...) VALUES
('Your Company', 'Your Position', '2023-01-01', ...);

-- Add job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(1, 'Your key responsibility', 1);
```

### 3. Update Skills
```sql
INSERT INTO skills (skill_name, category, proficiency_level) VALUES
('Your Skill', 'Category', 'Expert');
```

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart application
docker-compose restart

# Rebuild containers
docker-compose up --build

# Clean everything
docker-compose down -v && docker system prune -f
```

## 🚀 API Endpoints

- `GET /api/resume` - Complete resume data
- `GET /api/resume/word` - Download resume as Word document
- `GET /api/personal-info` - Personal information
- `GET /api/experience` - Work experience
- `GET /api/education` - Education background
- `GET /api/skills` - Skills by category
- `GET /api/projects` - Projects portfolio
- `GET /api/certifications` - Certifications

## 🎯 Next Steps

1. **Customize the sample data** in `database/init.sql` with your actual resume information
2. **Restart the containers** to see your changes: `docker-compose restart`
3. **Style customization**: Modify the CSS in `frontend/src/App.css`
4. **Deploy to cloud**: Ready for Azure, AWS, or any Docker-compatible platform

## 🆘 Troubleshooting

### Containers won't start?
```bash
# Check Docker is running
docker info

# Check container status
docker-compose ps

# View detailed logs
docker-compose logs
```

### Port conflicts?
Edit the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "5001:5000"  # Backend
  - "3307:3306"  # MySQL
```

### Need to reset database?
```bash
docker-compose down -v
docker-compose up
```

## 📝 Features

✅ Responsive design  
✅ Modern React components  
✅ RESTful API  
✅ MySQL database  
✅ Docker containerization  
✅ Error handling  
✅ Loading states  
✅ Print-friendly CSS  
✅ Professional styling  
✅ Health checks  
✅ Word document download  

---

**Built with ❤️ using React, Node.js, MySQL, and Docker**

Need help? Check the logs with `docker-compose logs -f` or open an issue!
