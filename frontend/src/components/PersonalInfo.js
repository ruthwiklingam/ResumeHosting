import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

const PersonalInfo = ({ data }) => {
  if (!data) return null;

  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    linkedin,
    github,
    website,
    summary
  } = data;

  return (
    <div className="section-card fade-in">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {first_name} {last_name}
        </h1>
        
        {/* Contact Information */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 mb-4">
          {email && (
            <a href={`mailto:${email}`} className="external-link">
              <FaEnvelope className="text-sm" />
              {email}
            </a>
          )}
          
          {phone && (
            <a href={`tel:${phone}`} className="external-link">
              <FaPhone className="text-sm" />
              {phone}
            </a>
          )}
          
          {address && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-sm" />
              {address}
            </span>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-6">
          {linkedin && (
            <a 
              href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              <FaLinkedin className="text-lg" />
              LinkedIn
            </a>
          )}
          
          {github && (
            <a 
              href={github.startsWith('http') ? github : `https://${github}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              <FaGithub className="text-lg" />
              GitHub
            </a>
          )}
          
          {website && (
            <a 
              href={website.startsWith('http') ? website : `https://${website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              <FaGlobe className="text-lg" />
              Website
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
