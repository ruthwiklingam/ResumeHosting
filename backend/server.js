const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const officegen = require('officegen');
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

// Generate Word document version of resume
app.get('/api/resume/word', asyncHandler(async (req, res) => {
  try {
    // Get complete resume data (reuse the same logic as Word endpoint)
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

    // Create Word document
    const docx = officegen('docx');
    
    // Set document properties (only use available methods)
    docx.setDocTitle(`Resume - ${resumeData.personalInfo?.first_name} ${resumeData.personalInfo?.last_name}`);
    docx.setDocSubject('Professional Resume');
    docx.setDocKeywords('resume, professional, career');
    
    // Generate Word document content
    generateWordDocument(docx, resumeData);
    
    // Set response headers
    const fileName = `${resumeData.personalInfo?.first_name || 'Resume'}_${resumeData.personalInfo?.last_name || 'Resume'}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the document to response
    docx.generate(res);
    
  } catch (error) {
    console.error('Error generating Word document:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating Word document'
    });
  }
}));

// Generate Word document version of resume
app.get('/api/resume/word', asyncHandler(async (req, res) => {
  try {
    // Get complete resume data (reuse the same logic as PDF endpoint)
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

    // Create Word document
    const docx = officegen('docx');
    
    // Set document properties (only use available methods)
    docx.setDocTitle(`Resume - ${resumeData.personalInfo?.first_name} ${resumeData.personalInfo?.last_name}`);
    docx.setDocSubject('Professional Resume');
    docx.setDocKeywords('resume, professional, career');
    
    // Generate Word document content
    generateWordDocument(docx, resumeData);
    
    // Set response headers
    const fileName = `${resumeData.personalInfo?.first_name || 'Resume'}_${resumeData.personalInfo?.last_name || 'Resume'}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the document to response
    docx.generate(res);
    
  } catch (error) {
    console.error('Error generating Word document:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating Word document'
    });
  }
}));

// Helper function to generate Word document
function generateWordDocument(docx, resumeData) {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Header - Personal Information
  if (personalInfo) {
    const pObj = docx.createP({ align: 'center' });
    pObj.addText(`${personalInfo.first_name || ''} ${personalInfo.last_name || ''}`, {
      font_size: 24,
      bold: true,
      color: '2563eb'
    });
    
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(`📧 ${personalInfo.email}`);
    if (personalInfo.phone) contactInfo.push(`📞 ${personalInfo.phone}`);
    if (personalInfo.address) contactInfo.push(`📍 ${personalInfo.address}`);
    if (personalInfo.linkedin) contactInfo.push(`🔗 ${personalInfo.linkedin}`);
    
    if (contactInfo.length > 0) {
      const contactP = docx.createP({ align: 'center' });
      contactP.addText(contactInfo.join(' | '), {
        font_size: 11,
        color: '6b7280'
      });
    }
    
    // Add line break
    docx.createP();
  }

  // Professional Summary
  if (personalInfo?.summary) {
    const summaryTitle = docx.createP();
    summaryTitle.addText('PROFESSIONAL SUMMARY', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    const summaryP = docx.createP();
    summaryP.addText(personalInfo.summary, {
      font_size: 11,
      color: '4b5563'
    });
    
    docx.createP();
  }

  // Professional Experience
  if (experience && experience.length > 0) {
    const expTitle = docx.createP();
    expTitle.addText('PROFESSIONAL EXPERIENCE', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    experience.forEach(exp => {
      const expP = docx.createP();
      expP.addText(exp.position, {
        font_size: 12,
        bold: true,
        color: '1f2937'
      });
      
      const companyP = docx.createP();
      companyP.addText(exp.company_name, {
        font_size: 11,
        color: '2563eb',
        bold: true
      });
      
      const dateP = docx.createP();
      dateP.addText(`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`, {
        font_size: 10,
        color: '6b7280',
        italic: true
      });
      
      if (exp.location) {
        const locationP = docx.createP();
        locationP.addText(exp.location, {
          font_size: 10,
          color: '6b7280'
        });
      }
      
      if (exp.duties && exp.duties.length > 0) {
        exp.duties.forEach(duty => {
          const dutyP = docx.createP();
          dutyP.addText(`• ${duty}`, {
            font_size: 10,
            color: '4b5563'
          });
        });
      }
      
      docx.createP();
    });
  }

  // Education
  if (education && education.length > 0) {
    const eduTitle = docx.createP();
    eduTitle.addText('EDUCATION', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    education.forEach(edu => {
      const degreeP = docx.createP();
      degreeP.addText(`${edu.degree} in ${edu.field_of_study}`, {
        font_size: 12,
        bold: true,
        color: '1f2937'
      });
      
      const institutionP = docx.createP();
      institutionP.addText(edu.institution, {
        font_size: 11,
        color: '2563eb',
        bold: true
      });
      
      const eduDateP = docx.createP();
      eduDateP.addText(`${edu.start_year_month} - ${edu.end_year_month}`, {
        font_size: 10,
        color: '6b7280',
        italic: true
      });
      
      if (edu.location) {
        const eduLocationP = docx.createP();
        eduLocationP.addText(edu.location, {
          font_size: 10,
          color: '6b7280'
        });
      }
    });
    
    docx.createP();
  }

  // Skills
  if (skills && Object.keys(skills).length > 0) {
    const skillsTitle = docx.createP();
    skillsTitle.addText('TECHNICAL SKILLS', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    Object.entries(skills).forEach(([category, skillList]) => {
      const categoryP = docx.createP();
      categoryP.addText(category, {
        font_size: 11,
        bold: true,
        color: '1f2937'
      });
      
      const skillsP = docx.createP();
      skillsP.addText(skillList.map(skill => skill.skill_name).join(', '), {
        font_size: 10,
        color: '4b5563'
      });
    });
    
    docx.createP();
  }

  // Projects
  if (projects && projects.length > 0) {
    const projectsTitle = docx.createP();
    projectsTitle.addText('KEY PROJECTS', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    projects.forEach(project => {
      const projectP = docx.createP();
      projectP.addText(project.project_name, {
        font_size: 12,
        bold: true,
        color: '1f2937'
      });
      
      const descP = docx.createP();
      descP.addText(project.description, {
        font_size: 10,
        color: '4b5563'
      });
      
      if (project.technologies) {
        const techP = docx.createP();
        techP.addText(`Technologies: ${project.technologies}`, {
          font_size: 10,
          color: '6b7280',
          italic: true
        });
      }
    });
    
    docx.createP();
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    const certsTitle = docx.createP();
    certsTitle.addText('CERTIFICATIONS', {
      font_size: 14,
      bold: true,
      color: '1f2937'
    });
    
    certifications.forEach(cert => {
      const certP = docx.createP();
      certP.addText(cert.certification_name, {
        font_size: 12,
        bold: true,
        color: '1f2937'
      });
      
      const orgP = docx.createP();
      orgP.addText(cert.issuing_organization, {
        font_size: 11,
        color: '2563eb',
        bold: true
      });
      
      const certDateP = docx.createP();
      certDateP.addText(formatDate(cert.issue_date), {
        font_size: 10,
        color: '6b7280',
        italic: true
      });
      
      if (cert.credential_id) {
        const credP = docx.createP();
        credP.addText(`ID: ${cert.credential_id}`, {
          font_size: 10,
          color: '6b7280'
        });
      }
    });
  }
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
