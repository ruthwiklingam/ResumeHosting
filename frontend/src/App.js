import React, { useState, useEffect } from 'react';
import { resumeAPI } from './services/api';
import PersonalInfo from './components/PersonalInfo';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { FaFileWord } from 'react-icons/fa';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await resumeAPI.getCompleteResume();
      
      if (response.success) {
        setResumeData(response.data);
      } else {
        throw new Error('Failed to fetch resume data');
      }
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError(err.message || 'Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const downloadWord = async () => {
    try {
      // Create a simple download by opening the URL directly
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const wordUrl = `${apiUrl}/resume/word`;
      
      // Method 1: Try direct window.open approach (most reliable)
      const link = document.createElement('a');
      link.href = wordUrl;
      link.target = '_blank';
      link.download = `${resumeData?.personalInfo?.first_name || 'Resume'}_${resumeData?.personalInfo?.last_name || 'Resume'}.docx`;
      
      // Add to DOM temporarily for Firefox compatibility
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading Word document:', error);
      alert('Failed to download Word document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage 
          message={error} 
          onRetry={fetchResumeData}
        />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resume Data Found</h2>
          <button 
            onClick={fetchResumeData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Personal Information */}
        {resumeData.personalInfo && (
          <PersonalInfo data={resumeData.personalInfo} />
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Experience 
            data={resumeData.experience} 
            formatDate={formatDate}
          />
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <Education 
            data={resumeData.education} 
            formatDate={formatDate}
          />
        )}

        {/* Skills */}
        {resumeData.skills && Object.keys(resumeData.skills).length > 0 && (
          <Skills data={resumeData.skills} />
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <Projects 
            data={resumeData.projects} 
            formatDate={formatDate}
          />
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <Certifications 
            data={resumeData.certifications} 
            formatDate={formatDate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Download Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={downloadWord}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              title="Download Word Resume"
            >
              <FaFileWord />
              <span>Download Word</span>
            </button>
          </div>
          
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Resume Hosting App. Built with React & Node.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
