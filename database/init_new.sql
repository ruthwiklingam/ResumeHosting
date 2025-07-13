-- Initialize the resume database

USE resume_db;

-- Personal information table
CREATE TABLE personal_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    website VARCHAR(255),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job duties/responsibilities table
CREATE TABLE job_duties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    experience_id INT NOT NULL,
    duty_description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

-- Education table
CREATE TABLE education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_year_month VARCHAR(7), -- Format: YYYY-MM
    end_year_month VARCHAR(7),   -- Format: YYYY-MM
    gpa DECIMAL(3,2),
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT,
    start_date DATE,
    end_date DATE,
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO personal_info (first_name, last_name, email, phone, address, linkedin, summary) VALUES
('Ruthwik Reddy', 'Lingam', 'ruthwik.reddy176@gmail.com', '(213) 833-8433', 'Chicago, Illinois, USA', 'linkedin.com/in/ruthwikreddyl', 
'Results-driven DevOps engineer with extensive experience in designing, implementing, and managing cloud-based infrastructure and automation solutions. Proficient in Infrastructure as Code (IAC) principles, Docker, Kubernetes, virtual networks, CI/CD pipelines, Jenkins, GitHub Actions, Azure, AWS (Amazon Web Services), security, Kafka, and databases. Strong problem-solving abilities and a proven record of accomplishment in optimizing software development processes, improving efficiency, and ensuring secure and scalable systems.');

INSERT INTO experience (company_name, position, start_date, end_date, is_current, location, description) VALUES
('University of Illinois, Chicago', 'DevOps Engineer', '2020-06-01', NULL, TRUE, 'Chicago, IL', 'Designing, building, and evolving cloud infrastructure, strategically employing automation and infrastructure-as-code (IAC).'),
('J.B. Hunt Transport, Inc', 'DevOps Engineer', '2018-12-01', '2020-05-31', FALSE, 'Lowell, AR', 'Participating in scrum meetings and coordinating with business analysts to understand business needs and implement them into functional design.'),
('Select Minds', 'DevOps Engineer', '2018-08-01', '2018-12-31', FALSE, 'Remote', 'Configured AWS IAM and Security Group in Public and Private Subnets in VPC and worked on automation and CI/CD pipeline setup.');

-- University of Illinois, Chicago job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(1, 'Designing, building, and evolving cloud infrastructure, strategically employing automation and infrastructure-as-code (IAC)', 1),
(1, 'Working on automation and setting up CI/CD pipelines with GitHub Actions and Jenkins', 2),
(1, 'Leading a team of junior developers and assisting in the development of various web applications across the campus', 3),
(1, 'Setting up high-level and low-level environments for hosting web applications on both cloud platforms and on-prem servers', 4),
(1, 'Deploying and managing containerized infrastructure using Docker and Kubernetes', 5),
(1, 'Working on feature flag deployments using tools such as Launch Darkly', 6),
(1, 'Setting up Key Vaults for application-related sensitive information', 7),
(1, 'Conducted routine maintenance and performance tuning to ensure the NAS and backup systems operated at peak efficiency', 8),
(1, 'Establishing, documenting, and guiding architecture for various web applications', 9),
(1, 'Working on software-as-a-service tool called Pantheon to migrate to an on-prem campus WordPress multi-site service to the cloud', 10),
(1, 'Setting up local development for campus WordPress websites using Lando and Docker', 11),
(1, 'Provisioning application development environments using container management systems like Docker and Docker-compose', 12),
(1, 'Extending configuration management tools like Chef by developing cookbooks for various web services and backend technologies', 13),
(1, 'Maintaining, monitoring, and deploying applications on Azure Cloud using resources such as Azure Container Registry, AKS, and Azure Active Directory', 14),
(1, 'Setting up logging and monitoring for web applications using tools such as Splunk and New Relic', 15),
(1, 'Utilizing Terraform to create, change, and improve infrastructure across multiple cloud platforms safely and predictably', 16),
(1, 'Managed and optimized Kafka clusters for real-time data streaming, enabling efficient data ingestion and processing for various applications', 17),
(1, 'Implemented robust security measures and documentation protocols to ensure compliance with HIPAA', 18);

-- J.B. Hunt Transport job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(2, 'Participating in scrum meetings and coordinating with business analysts to understand the business needs and implement them into functional design', 1),
(2, 'Migrating databases from on-prem to cloud database services', 2),
(2, 'Setting up Kubernetes clusters using Terraform on multiple cloud services Azure and AWS', 3),
(2, 'Setting up access for users on cloud by using privileged access management and privileged identity management for multi cloud access management', 4),
(2, 'Setting up blue/green deployment environments for application deployment with low downtime', 5),
(2, 'Setting up private network environment for application across multiple cloud such as AWS and Azure', 6),
(2, 'Creating Azure pipelines for CI/CD using Azure pipelines integrating Azure repos as source code management (SCM) to deploy', 7),
(2, 'Setting up automated testing pipelines using Protractor', 8),
(2, 'Setting up web server configuration for applications with Nginx and Apache', 9),
(2, 'Setting up load testing scripts for applications/websites for traffic handling and auto scaling', 10),
(2, 'Writing configuration management scripts to automate setting up cloud system architecture for application deployment', 11);

-- Select Minds job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(3, 'Configured AWS IAM and Security Group in Public and Private Subnets in VPC', 1),
(3, 'Created AWS Route53 to route traffic between different regions', 2),
(3, 'Configure and administrate source code repositories for enterprise projects', 3),
(3, 'Worked on automation and CI/CD pipeline setup with Jenkins for build and deploying applications', 4),
(3, 'Used Ansible as an automation engine for cloud provisioning and configuration management', 5),
(3, 'Researching new tools and technologies to solve problems and prototype innovative ideas', 6);

INSERT INTO education (institution, degree, field_of_study, start_year_month, end_year_month, location) VALUES
('JNTU', 'Bachelor of Engineering', 'Electronics and Communication Engineering', '2012-08', '2016-05', 'Hyderabad, India');

INSERT INTO skills (skill_name, category, proficiency_level) VALUES
-- Operating Systems
('Linux', 'Operating Systems', 'Expert'),
('Windows', 'Operating Systems', 'Advanced'),
('macOS', 'Operating Systems', 'Advanced'),
-- Scripting Languages
('Bash', 'Scripting Languages', 'Expert'),
('Shell', 'Scripting Languages', 'Expert'),
('Ruby', 'Scripting Languages', 'Advanced'),
('Python', 'Scripting Languages', 'Expert'),
('JavaScript', 'Scripting Languages', 'Advanced'),
-- Application Servers
('Apache Tomcat 5.x/7.x', 'Application Servers', 'Advanced'),
('Nginx', 'Application Servers', 'Expert'),
-- Databases
('RDS', 'Databases', 'Advanced'),
('SQL', 'Databases', 'Expert'),
('PostgreSQL', 'Databases', 'Advanced'),
('MySQL', 'Databases', 'Advanced'),
('MongoDB', 'Databases', 'Intermediate'),
-- Messaging Systems
('Kafka', 'Messaging Systems', 'Advanced'),
('RabbitMQ', 'Messaging Systems', 'Intermediate'),
-- Configuration Management
('Terraform', 'Configuration Management', 'Expert'),
('Ansible', 'Configuration Management', 'Advanced'),
('Chef', 'Configuration Management', 'Advanced'),
-- CI/CD Tools
('GitHub Actions', 'CI/CD Tools', 'Expert'),
('Jenkins', 'CI/CD Tools', 'Expert'),
('Azure DevOps', 'CI/CD Tools', 'Advanced'),
-- Cloud Platforms
('Azure', 'Cloud Platforms', 'Expert'),
('Amazon Web Services (AWS)', 'Cloud Platforms', 'Expert'),
('GCP', 'Cloud Platforms', 'Advanced'),
-- Logging Tools
('Splunk', 'Logging Tools', 'Advanced'),
('Azure Log Monitor', 'Logging Tools', 'Advanced'),
('Prometheus', 'Logging Tools', 'Intermediate'),
('Grafana', 'Logging Tools', 'Intermediate'),
-- Security & Infrastructure
('Azure Key Vault', 'Security & Infrastructure', 'Advanced'),
('AWS Vault', 'Security & Infrastructure', 'Advanced'),
('Credentials Manager', 'Security & Infrastructure', 'Advanced'),
('Firewall', 'Security & Infrastructure', 'Advanced'),
('VPN', 'Security & Infrastructure', 'Advanced');

-- Updated Projects (All 10 UIC Projects)
INSERT INTO projects (project_name, description, technologies) VALUES
('Jenkins to GitHub Migration', 'Migration of application/code deployments from Jenkins to GitHub Actions for Azure cloud and on-premises environments', 'Jenkins, GitHub Actions, Azure, CI/CD'),
('GitHub ARC Self-Hosted Runners', 'Setting up self-hosted GitHub ARC for CI/CD using kind clusters and migrating existing workflows to use auto-scaling GitHub ARC setup', 'GitHub Actions, Kubernetes, Kind, GitHub ARC, CI/CD'),
('Pantheon WordPress CI/CD', 'Setting up CI/CD pipelines to deploy to Pantheon WordPress environment using GitHub Actions', 'GitHub Actions, WordPress, Pantheon, CI/CD'),
('Azure AKS Management', 'Setting up and maintaining Azure AKS clusters for application hosting and writing configuration files for hosting applications on AKS', 'Azure AKS, Kubernetes, Docker, YAML'),
('On-Premises Infrastructure', 'Setting up on-premises infrastructure for hosting applications using Docker and k3s', 'Docker, k3s, Kubernetes, On-Premises'),
('Multi-Cloud VPC Setup', 'Setting up VPCs on both Azure and AWS for securing applications to access over specific networks', 'Azure VNet, AWS VPC, Networking, Security'),
('Logging Dashboard Setup', 'Setting up logging dashboards using Elasticsearch, Kibana and Docker for comprehensive system monitoring and log analysis', 'Elasticsearch, Kibana, Docker, Logging, Monitoring'),
('Custom Domain Automation for Pantheon', 'Automating custom domain setup on EIP for Pantheon related websites to streamline deployment processes', 'Pantheon, EIP, DNS, Automation, Domain Management'),
('Kubernetes Dashboard with Azure SSO', 'Setting up Kubernetes dashboard for monitoring GitHub ARC setup on kind cluster with Azure SSO implementation and ingress with custom domain name', 'Kubernetes, Kind, GitHub ARC, Azure SSO, Ingress, Dashboard, Monitoring'),
('Organizational Automation as a Service', 'Working on setting up automation as a service across the organization for automation, hosting, and monitoring solutions', 'Automation, Service Architecture, Hosting, Monitoring, DevOps');

-- Updated Certifications (All 4 with Credly URLs)
INSERT INTO certifications (certification_name, issuing_organization, issue_date, credential_id, credential_url) VALUES
('Microsoft Certified: Azure Fundamentals', 'Microsoft', '2023-01-01', 'AZ-900', null),
('AWS Certified Developer- Associate', 'Amazon Web Services', '2022-06-01', 'DVA-C01', null),
('GitHub Actions Certification/Badge', 'GitHub', '2023-03-01', 'GH-ACTIONS-2023', 'https://www.credly.com/badges/aa4f749c-5e72-416c-899a-d97278d85bb2/public_url'),
('CKA: Certified Kubernetes Administrator', 'Cloud Native Computing Foundation (CNCF)', '2023-09-01', 'CKA-2023', 'https://www.credly.com/badges/6a8ff300-6efb-45fb-89b4-5f0e6e0cfe6f/public_url');
