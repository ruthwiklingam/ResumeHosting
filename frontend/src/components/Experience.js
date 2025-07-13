import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const Experience = ({ data, formatDate }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="section-card slide-in">
      <h2 className="section-title">Professional Experience</h2>
      
      <div className="space-y-6">
        {data.map((experience, index) => (
          <div 
            key={experience.id} 
            className={`experience-item ${experience.is_current ? 'current' : ''}`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {experience.position}
                </h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-1">
                  {experience.company_name}
                </h4>
              </div>
              
              <div className="text-sm text-gray-600 md:text-right">
                <div className="flex items-center gap-1 mb-1">
                  <FaCalendarAlt className="text-xs" />
                  <span>
                    {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                    {experience.is_current && (
                      <span className="ml-1 text-green-600 font-medium">(Current)</span>
                    )}
                  </span>
                </div>
                
                {experience.location && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            </div>

            {experience.description && (
              <p className="text-gray-700 mb-3 leading-relaxed">
                {experience.description}
              </p>
            )}

            {experience.duties && experience.duties.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Key Responsibilities:</h5>
                <ul className="duty-list">
                  {experience.duties.map((duty, dutyIndex) => (
                    <li key={dutyIndex}>{duty}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
