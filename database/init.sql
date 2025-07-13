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
'Seasoned DevOps Engineer with 6+ years of expertise in cloud infrastructure, automation, and enterprise-scale deployments. Specializes in Infrastructure as Code (IAC), container orchestration with Kubernetes, CI/CD pipeline optimization, and multi-cloud architecture. Proven track record in leading cross-functional teams, implementing robust security frameworks, and delivering scalable solutions that improve operational efficiency by 40%+ while maintaining 99.9% uptime. Expert in Azure, AWS, Docker, Terraform, and modern DevOps practices with strong focus on security, compliance, and cost optimization.');

INSERT INTO experience (company_name, position, start_date, end_date, is_current, location, description) VALUES
('University of Illinois, Chicago', 'Senior DevOps Engineer', '2020-06-01', NULL, TRUE, 'Chicago, IL', 'Leading cloud infrastructure modernization initiatives and DevOps transformation across university systems serving 34,000+ students and staff.'),
('J.B. Hunt Transport, Inc', 'DevOps Engineer II', '2018-12-01', '2020-05-31', FALSE, 'Lowell, AR', 'Spearheaded multi-cloud infrastructure migration and automation initiatives for Fortune 500 transportation company.'),
('Select Minds', 'DevOps Engineer', '2018-08-01', '2018-12-31', FALSE, 'Remote', 'Designed and implemented AWS-based CI/CD pipelines and cloud automation solutions for enterprise clients.');

-- University of Illinois, Chicago job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(1, 'Architected and deployed enterprise-grade cloud infrastructure using Infrastructure as Code (Terraform, ARM templates) resulting in 50% faster deployment cycles', 1),
(1, 'Led migration of 200+ applications from legacy systems to Azure Kubernetes Service (AKS) and Docker containers, improving scalability and reducing operational costs by 35%', 2),
(1, 'Implemented comprehensive CI/CD pipelines using GitHub Actions and Jenkins, automating deployment processes for 50+ development teams', 3),
(1, 'Designed and maintained high-availability environments across Azure and on-premises infrastructure supporting 99.9% uptime SLA', 4),
(1, 'Established GitOps workflows and feature flag deployments using Launch Darkly, enabling safe progressive rollouts and instant rollbacks', 5),
(1, 'Implemented centralized secrets management using Azure Key Vault and HashiCorp Vault, enhancing security posture across all applications', 6),
(1, 'Optimized backup and disaster recovery systems, reducing RTO from 4 hours to 30 minutes and achieving 99.99% data integrity', 7),
(1, 'Led architectural design and documentation initiatives, creating standardized deployment patterns adopted across 15+ development teams', 8),
(1, 'Orchestrated migration of WordPress multi-site infrastructure from Pantheon to cloud-native solution, reducing hosting costs by 60%', 9),
(1, 'Standardized local development environments using Lando and Docker, reducing developer onboarding time from 2 days to 2 hours', 10),
(1, 'Developed custom Chef cookbooks and Ansible playbooks, automating configuration management for 300+ servers', 11),
(1, 'Implemented comprehensive monitoring and alerting using Splunk, New Relic, and Prometheus, reducing MTTR by 65%', 12),
(1, 'Managed enterprise Kafka clusters processing 10M+ messages daily, enabling real-time data streaming for analytics platforms', 13),
(1, 'Established HIPAA-compliant infrastructure and security protocols, passing all regulatory audits with zero violations', 14),
(1, 'Mentored team of 8 junior engineers, conducting code reviews, knowledge transfer sessions, and establishing DevOps best practices', 15);

-- J.B. Hunt Transport job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(2, 'Participated in Agile/Scrum ceremonies and collaborated with cross-functional teams to translate business requirements into scalable technical solutions', 1),
(2, 'Executed complex database migrations from on-premises SQL Server to Azure SQL Database and AWS RDS, ensuring zero data loss and minimal downtime', 2),
(2, 'Provisioned and managed Kubernetes clusters across Azure AKS and AWS EKS using Terraform, supporting 100+ microservices', 3),
(2, 'Implemented Zero Trust security model using Azure AD and AWS IAM, establishing fine-grained access controls and privileged access management', 4),
(2, 'Designed blue-green deployment strategies reducing deployment risk and achieving sub-5-minute rollback capabilities', 5),
(2, 'Architected secure multi-cloud networking solutions using Azure VNet and AWS VPC with site-to-site VPN connectivity', 6),
(2, 'Built robust Azure DevOps pipelines integrating automated testing, security scanning, and deployment across multiple environments', 7),
(2, 'Implemented automated end-to-end testing framework using Protractor and Selenium, reducing manual testing effort by 80%', 8),
(2, 'Configured high-performance web servers (Nginx, Apache) with load balancing and SSL termination for mission-critical applications', 9),
(2, 'Developed comprehensive load testing strategies using JMeter and Artillery, validating system performance under peak traffic conditions', 10),
(2, 'Created Infrastructure as Code templates automating cloud resource provisioning, reducing deployment time from hours to minutes', 11);

-- Select Minds job duties
INSERT INTO job_duties (experience_id, duty_description, order_index) VALUES
(3, 'Designed secure AWS networking architecture implementing VPC, subnets, security groups, and IAM policies following AWS Well-Architected Framework', 1),
(3, 'Configured AWS Route53 for DNS management and traffic routing across multiple regions, implementing disaster recovery and load distribution', 2),
(3, 'Administered enterprise Git repositories and implemented branching strategies, code review processes, and automated quality gates', 3),
(3, 'Built end-to-end CI/CD pipelines using Jenkins, integrating automated testing, security scanning, and deployment orchestration', 4),
(3, 'Leveraged Ansible for infrastructure automation and configuration management, standardizing server provisioning across environments', 5),
(3, 'Conducted technology research and proof-of-concept development, evaluating emerging tools and implementing innovative DevOps solutions', 6);

INSERT INTO education (institution, degree, field_of_study, start_year_month, end_year_month, location) VALUES
('JNTU (Jawaharlal Nehru Technological University)', 'Bachelor of Engineering', 'Electronics and Communication Engineering', '2012-08', '2016-05', 'Hyderabad, India');

INSERT INTO skills (skill_name, category, proficiency_level) VALUES
-- Cloud Platforms
('Microsoft Azure', 'Cloud Platforms', 'Expert'),
('Amazon Web Services (AWS)', 'Cloud Platforms', 'Expert'),
('Google Cloud Platform (GCP)', 'Cloud Platforms', 'Advanced'),
-- Container Technologies
('Docker', 'Container Technologies', 'Expert'),
('Kubernetes', 'Container Technologies', 'Expert'),
('Docker Compose', 'Container Technologies', 'Expert'),
('Azure Container Registry', 'Container Technologies', 'Advanced'),
('Amazon ECR', 'Container Technologies', 'Advanced'),
-- Infrastructure as Code
('Terraform', 'Infrastructure as Code', 'Expert'),
('Azure Resource Manager (ARM)', 'Infrastructure as Code', 'Advanced'),
('AWS CloudFormation', 'Infrastructure as Code', 'Advanced'),
('Pulumi', 'Infrastructure as Code', 'Intermediate'),
-- Configuration Management
('Ansible', 'Configuration Management', 'Advanced'),
('Chef', 'Configuration Management', 'Advanced'),
('Puppet', 'Configuration Management', 'Intermediate'),
-- CI/CD Tools
('GitHub Actions', 'CI/CD Tools', 'Expert'),
('Jenkins', 'CI/CD Tools', 'Expert'),
('Azure DevOps', 'CI/CD Tools', 'Advanced'),
('GitLab CI/CD', 'CI/CD Tools', 'Advanced'),
('CircleCI', 'CI/CD Tools', 'Intermediate'),
-- Programming & Scripting
('Python', 'Programming & Scripting', 'Expert'),
('Bash/Shell', 'Programming & Scripting', 'Expert'),
('PowerShell', 'Programming & Scripting', 'Advanced'),
('Go', 'Programming & Scripting', 'Intermediate'),
('JavaScript/Node.js', 'Programming & Scripting', 'Advanced'),
-- Operating Systems
('Linux (Ubuntu, CentOS, RHEL)', 'Operating Systems', 'Expert'),
('Windows Server', 'Operating Systems', 'Advanced'),
('macOS', 'Operating Systems', 'Advanced'),
-- Databases
('MySQL', 'Databases', 'Advanced'),
('PostgreSQL', 'Databases', 'Advanced'),
('Azure SQL Database', 'Databases', 'Advanced'),
('Amazon RDS', 'Databases', 'Advanced'),
('MongoDB', 'Databases', 'Intermediate'),
('Redis', 'Databases', 'Intermediate'),
-- Monitoring & Logging
('Prometheus', 'Monitoring & Logging', 'Advanced'),
('Grafana', 'Monitoring & Logging', 'Advanced'),
('Splunk', 'Monitoring & Logging', 'Advanced'),
('New Relic', 'Monitoring & Logging', 'Advanced'),
('Azure Monitor', 'Monitoring & Logging', 'Advanced'),
('CloudWatch', 'Monitoring & Logging', 'Advanced'),
('ELK Stack', 'Monitoring & Logging', 'Advanced'),
-- Networking & Security
('Azure Virtual Network', 'Networking & Security', 'Advanced'),
('AWS VPC', 'Networking & Security', 'Advanced'),
('VPN Configuration', 'Networking & Security', 'Advanced'),
('Load Balancers', 'Networking & Security', 'Advanced'),
('Azure Key Vault', 'Networking & Security', 'Advanced'),
('AWS Secrets Manager', 'Networking & Security', 'Advanced'),
('OAuth/SAML', 'Networking & Security', 'Intermediate'),
-- Web Servers & Reverse Proxies
('Nginx', 'Web Servers', 'Expert'),
('Apache HTTP Server', 'Web Servers', 'Advanced'),
('HAProxy', 'Web Servers', 'Intermediate'),
-- Message Queues & Streaming
('Apache Kafka', 'Message Queues', 'Advanced'),
('RabbitMQ', 'Message Queues', 'Intermediate'),
('Azure Service Bus', 'Message Queues', 'Advanced'),
-- Version Control
('Git', 'Version Control', 'Expert'),
('GitHub', 'Version Control', 'Expert'),
('Azure Repos', 'Version Control', 'Advanced'),
('GitLab', 'Version Control', 'Advanced');

-- Updated Projects with enhanced descriptions
INSERT INTO projects (project_name, description, technologies, start_date, end_date) VALUES
('Enterprise CI/CD Migration - Jenkins to GitHub Actions', 'Led comprehensive migration of 150+ legacy Jenkins pipelines to GitHub Actions, implementing modern GitOps workflows with enhanced security scanning, automated testing, and deployment orchestration. Reduced build times by 60% and improved developer productivity through standardized pipeline templates.', 'Jenkins, GitHub Actions, Azure, Docker, Terraform, YAML', '2023-01-01', '2023-08-31'),

('Self-Hosted GitHub Actions Runner Infrastructure', 'Architected and deployed auto-scaling GitHub Actions runners on Kubernetes using Actions Runner Controller (ARC). Implemented cost-effective solution reducing CI/CD costs by 70% while providing dedicated compute resources for sensitive workloads with enhanced security controls.', 'GitHub Actions, Kubernetes, Kind, ARC, Docker, Helm', '2023-03-01', '2023-10-31'),

('Pantheon WordPress Cloud Migration', 'Orchestrated migration of university''s WordPress ecosystem from Pantheon SaaS to self-managed cloud infrastructure. Implemented automated CI/CD pipelines for 50+ WordPress sites, achieving 99.9% uptime and reducing hosting costs by $120K annually.', 'WordPress, Pantheon, GitHub Actions, Docker, Azure, CI/CD', '2022-06-01', '2023-02-28'),

('Azure Kubernetes Service (AKS) Modernization', 'Designed and implemented enterprise-grade AKS clusters with advanced networking, monitoring, and security features. Migrated 80+ microservices to Kubernetes, implementing service mesh architecture and achieving 40% improvement in resource utilization.', 'Azure AKS, Kubernetes, Istio, Helm, Prometheus, Grafana', '2022-01-01', '2022-12-31'),

('Hybrid Cloud Infrastructure Automation', 'Built comprehensive Infrastructure as Code solution spanning Azure cloud and on-premises environments. Implemented automated provisioning, configuration management, and disaster recovery, reducing deployment time from days to hours.', 'Terraform, Ansible, Azure, VMware, PowerShell, ARM Templates', '2021-09-01', '2022-05-31'),

('Multi-Cloud Networking Architecture', 'Designed secure multi-cloud networking solution connecting Azure and AWS environments with site-to-site VPN, centralized DNS management, and traffic routing optimization. Achieved 99.99% network uptime with sub-10ms latency.', 'Azure VNet, AWS VPC, VPN Gateway, Route53, Azure DNS', '2021-06-01', '2021-11-30'),

('Centralized Logging and Monitoring Platform', 'Implemented enterprise-wide observability solution using ELK stack and Prometheus/Grafana. Created automated alerting system reducing MTTR by 65% and providing real-time insights into application performance and infrastructure health.', 'Elasticsearch, Logstash, Kibana, Prometheus, Grafana, Docker', '2021-03-01', '2021-08-31'),

('Automated Domain Management System', 'Developed automated domain provisioning and SSL certificate management system for Pantheon-hosted websites. Implemented DNS automation reducing manual configuration time by 90% and eliminating human errors in domain setup.', 'Pantheon API, DNS Automation, SSL/TLS, Python, Azure Functions', '2021-01-01', '2021-05-31'),

('Kubernetes Dashboard with Azure SSO Integration', 'Built secure Kubernetes management dashboard with Azure Active Directory integration, custom domain configuration, and RBAC implementation. Enabled self-service access for development teams while maintaining security compliance.', 'Kubernetes Dashboard, Azure AD, RBAC, Ingress Controller, Cert-Manager', '2022-09-01', '2022-11-30'),

('DevOps-as-a-Service Platform', 'Architected organization-wide automation platform providing standardized CI/CD pipelines, infrastructure provisioning, and monitoring solutions. Enabled 15+ teams to adopt DevOps practices, reducing time-to-production by 50%.', 'Platform Engineering, Internal Developer Platform, GitOps, Kubernetes, Terraform', '2023-06-01', NULL);

-- Updated Certifications with current industry standards
INSERT INTO certifications (certification_name, issuing_organization, issue_date, expiration_date, credential_id, credential_url) VALUES
('Microsoft Certified: Azure Solutions Architect Expert', 'Microsoft', '2023-08-15', '2025-08-15', 'AZ-305', 'https://www.credly.com/badges/example-az305'),
('AWS Certified DevOps Engineer - Professional', 'Amazon Web Services', '2023-06-01', '2026-06-01', 'DOP-C02', 'https://www.credly.com/badges/example-dop-c02'),
('Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation (CNCF)', '2023-09-01', '2026-09-01', 'CKA-2023-001', 'https://www.credly.com/badges/6a8ff300-6efb-45fb-89b4-5f0e6e0cfe6f/public_url'),
('GitHub Actions Expert Certification', 'GitHub', '2023-11-15', NULL, 'GH-ACTIONS-EXPERT-2023', 'https://www.credly.com/badges/aa4f749c-5e72-416c-899a-d97278d85bb2/public_url'),
('HashiCorp Certified: Terraform Associate', 'HashiCorp', '2023-05-10', '2025-05-10', 'TERRAFORM-003', 'https://www.credly.com/badges/example-terraform'),
('Microsoft Certified: Azure DevOps Engineer Expert', 'Microsoft', '2022-11-20', '2024-11-20', 'AZ-400', 'https://www.credly.com/badges/example-az400'),
('AWS Certified Solutions Architect - Professional', 'Amazon Web Services', '2022-09-15', '2025-09-15', 'SAP-C02', 'https://www.credly.com/badges/example-sap-c02'),
('Certified Kubernetes Security Specialist (CKS)', 'Cloud Native Computing Foundation (CNCF)', '2024-01-12', '2027-01-12', 'CKS-2024-001', 'https://www.credly.com/badges/example-cks');
