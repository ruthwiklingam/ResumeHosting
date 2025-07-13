const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'resume_user',
  password: process.env.DB_PASSWORD || 'resume_password',
  database: process.env.DB_NAME || 'resume_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes

// Get personal information
app.get('/api/personal-info', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM personal_info ORDER BY created_at DESC LIMIT 1');

  if (rows.length === 1) {
    return res.status(404).json({ message: 'Personal information not found' });
  }
  
  res.json({
    success: true,
    data: rows[0]
  });
}));

// Get all experience with job duties
app.get('/api/experience', asyncHandler(async (req, res) => {
  const [experiences] = await pool.execute(`
    SELECT * FROM experience 
    ORDER BY start_date DESC
  `);
  
  // Get job duties for each experience
  for (let exp of experiences) {
    const [duties] = await pool.execute(`
      SELECT duty_description, order_index 
      FROM job_duties 
      WHERE experience_id = ? 
      ORDER BY order_index ASC
    `, [exp.id]);
    
    exp.duties = duties.map(duty => duty.duty_description);
  }
  
  res.json({
    success: true,
    data: experiences
  });
}));

// Get specific experience by ID
app.get('/api/experience/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const [experiences] = await pool.execute(`
    SELECT * FROM experience WHERE id = ?
  `, [id]);
  
  if (experiences.length === 0) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  
  const [duties] = await pool.execute(`
    SELECT duty_description, order_index 
    FROM job_duties 
    WHERE experience_id = ? 
    ORDER BY order_index ASC
  `, [id]);
  
  const experience = experiences[0];
  experience.duties = duties.map(duty => duty.duty_description);
  
  res.json({
    success: true,
    data: experience
  });
}));

// Get education
app.get('/api/education', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT * FROM education 
    ORDER BY end_year_month DESC
  `);
  
  res.json({
    success: true,
    data: rows
  });
}));

// Get skills grouped by category
app.get('/api/skills', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT * FROM skills 
    ORDER BY category, proficiency_level DESC, skill_name ASC
  `);
  
  // Group skills by category
  const groupedSkills = rows.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
  
  res.json({
    success: true,
    data: groupedSkills
  });
}));

// Get projects
app.get('/api/projects', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT * FROM projects 
    ORDER BY end_date DESC, start_date DESC
  `);
  
  res.json({
    success: true,
    data: rows
  });
}));

// Get certifications
app.get('/api/certifications', asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT * FROM certifications 
    ORDER BY issue_date DESC
  `);
  
  res.json({
    success: true,
    data: rows
  });
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Resume API is running',
    timestamp: new Date().toISOString()
  });
});

// Get complete resume data
app.get('/api/resume', asyncHandler(async (req, res) => {
  try {
    // Get all data in parallel
    const [
      [personalInfo],
      [experiences],
      [education],
      [skills],
      [projects],
      [certifications]
    ] = await Promise.all([
      pool.execute('SELECT * FROM personal_info ORDER BY created_at DESC LIMIT 1'),
      pool.execute('SELECT * FROM experience ORDER BY start_date DESC'),
      pool.execute('SELECT * FROM education ORDER BY end_year_month DESC'),
      pool.execute('SELECT * FROM skills ORDER BY category, proficiency_level DESC, skill_name ASC'),
      pool.execute('SELECT * FROM projects ORDER BY end_date DESC, start_date DESC'),
      pool.execute('SELECT * FROM certifications ORDER BY issue_date DESC')
    ]);
    
    // Get job duties for each experience
    for (let exp of experiences) {
      const [duties] = await pool.execute(`
        SELECT duty_description, order_index 
        FROM job_duties 
        WHERE experience_id = ? 
        ORDER BY order_index ASC
      `, [exp.id]);
      
      exp.duties = duties.map(duty => duty.duty_description);
    }
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        personalInfo: personalInfo[0] || null,
        experience: experiences,
        education: education,
        skills: groupedSkills,
        projects: projects,
        certifications: certifications
      }
    });
  } catch (error) {
    console.error('Error fetching complete resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume data'
    });
  }
}));

// Generate PDF version of resume
app.get('/api/resume/pdf', asyncHandler(async (req, res) => {
  try {
    // Get complete resume data (reuse the same logic as above)
    const [
      [personalInfo],
      [experiences],
      [education],
      [skills],
      [projects],
      [certifications]
    ] = await Promise.all([
      pool.execute('SELECT * FROM personal_info ORDER BY created_at DESC LIMIT 1'),
      pool.execute('SELECT * FROM experience ORDER BY start_date DESC'),
      pool.execute('SELECT * FROM education ORDER BY end_year_month DESC'),
      pool.execute('SELECT * FROM skills ORDER BY category, proficiency_level DESC, skill_name ASC'),
      pool.execute('SELECT * FROM projects ORDER BY end_date DESC, start_date DESC'),
      pool.execute('SELECT * FROM certifications ORDER BY issue_date DESC')
    ]);
    
    // Get job duties for each experience
    for (let exp of experiences) {
      const [duties] = await pool.execute(`
        SELECT duty_description, order_index 
        FROM job_duties 
        WHERE experience_id = ? 
        ORDER BY order_index ASC
      `, [exp.id]);
      
      exp.duties = duties.map(duty => duty.duty_description);
    }
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    const resumeData = {
      personalInfo: personalInfo[0] || null,
      experience: experiences,
      education: education,
      skills: groupedSkills,
      projects: projects,
      certifications: certifications
    };

    // Generate PDF using puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Create HTML content for PDF
    const htmlContent = generateResumeHTML(resumeData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in'
      }
    });
    
    await browser.close();
    
    // Set headers before sending response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo?.first_name || 'Resume'}_${resumeData.personalInfo?.last_name || 'Resume'}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    
    // Send the PDF buffer directly
    res.status(200).end(pdf);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF'
    });
  }
}));

// Helper function to generate HTML for PDF
function generateResumeHTML(resumeData) {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Resume - ${personalInfo?.first_name} ${personalInfo?.last_name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .name {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .contact-info {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 15px;
        }
        
        .contact-info span {
          margin: 0 10px;
        }
        
        .summary {
          font-size: 14px;
          color: #4b5563;
          text-align: justify;
          line-height: 1.5;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .experience-item, .education-item, .project-item, .cert-item {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        
        .item-title {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .item-subtitle {
          font-size: 14px;
          color: #2563eb;
          font-weight: 600;
        }
        
        .item-date {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
        }
        
        .item-location {
          font-size: 12px;
          color: #6b7280;
        }
        
        .duties-list {
          margin-top: 8px;
          padding-left: 20px;
        }
        
        .duties-list li {
          font-size: 13px;
          margin-bottom: 3px;
          color: #4b5563;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .skill-category {
          page-break-inside: avoid;
        }
        
        .skill-category-title {
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .skill-list {
          font-size: 12px;
          color: #4b5563;
          line-height: 1.4;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .project-item {
          page-break-inside: avoid;
        }
        
        .technologies {
          font-size: 11px;
          color: #6b7280;
          font-style: italic;
          margin-top: 5px;
        }
        
        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .cert-item {
          page-break-inside: avoid;
        }
        
        .cert-org {
          font-size: 13px;
          color: #2563eb;
          font-weight: 600;
        }
        
        .cert-id {
          font-size: 11px;
          color: #6b7280;
        }
        
        @media print {
          body { 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="contact-info">
            ${personalInfo?.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
            ${personalInfo?.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
            ${personalInfo?.address ? `<span>📍 ${personalInfo.address}</span>` : ''}
            ${personalInfo?.linkedin ? `<span>🔗 ${personalInfo.linkedin}</span>` : ''}
          </div>
          ${personalInfo?.summary ? `<div class="summary">${personalInfo.summary}</div>` : ''}
        </div>

        <!-- Experience -->
        ${experience && experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${experience.map(exp => `
            <div class="experience-item">
              <div class="item-title">${exp.position}</div>
              <div class="item-subtitle">${exp.company_name}</div>
              <div class="item-date">${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}</div>
              ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
              ${exp.duties && exp.duties.length > 0 ? `
                <ul class="duties-list">
                  ${exp.duties.map(duty => `<li>${duty}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${education && education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="education-item">
              <div class="item-title">${edu.degree} in ${edu.field_of_study}</div>
              <div class="item-subtitle">${edu.institution}</div>
              <div class="item-date">${edu.start_year_month} - ${edu.end_year_month}</div>
              ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${skills && Object.keys(skills).length > 0 ? `
        <div class="section">
          <div class="section-title">Technical Skills</div>
          <div class="skills-grid">
            ${Object.entries(skills).map(([category, skillList]) => `
              <div class="skill-category">
                <div class="skill-category-title">${category}</div>
                <div class="skill-list">
                  ${skillList.map(skill => skill.skill_name).join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Projects -->
        ${projects && projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Key Projects</div>
          <div class="projects-grid">
            ${projects.map(project => `
              <div class="project-item">
                <div class="item-title">${project.project_name}</div>
                <div class="item-subtitle">${project.description}</div>
                ${project.technologies ? `<div class="technologies">Technologies: ${project.technologies}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Certifications -->
        ${certifications && certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          <div class="certifications-grid">
            ${certifications.map(cert => `
              <div class="cert-item">
                <div class="item-title">${cert.certification_name}</div>
                <div class="cert-org">${cert.issuing_organization}</div>
                <div class="item-date">${formatDate(cert.issue_date)}</div>
                ${cert.credential_id ? `<div class="cert-id">ID: ${cert.credential_id}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  await testConnection();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Resume API server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);
