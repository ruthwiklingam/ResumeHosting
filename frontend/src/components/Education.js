import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const Education = ({ data, formatDate }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="section-card slide-in">
      <h2 className="section-title">Education</h2>
      
      <div className="space-y-4">
        {data.map((education, index) => (
          <div 
            key={education.id} 
            className="border-l-4 border-green-500 pl-6 relative"
          >
            <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-2 top-2"></div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaGraduationCap className="text-green-600" />
                  {education.degree}
                </h3>
                
                {education.field_of_study && (
                  <p className="text-lg text-gray-700 font-medium">
                    {education.field_of_study}
                  </p>
                )}
                
                <h4 className="text-lg font-semibold text-green-600 mb-2">
                  {education.institution}
                </h4>
                
                {education.description && (
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {education.description}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-600 md:text-right md:ml-4">
                <div className="flex items-center gap-1 mb-1">
                  <FaCalendarAlt className="text-xs" />
                  <span>
                    {education.start_year_month || 'N/A'} - {education.end_year_month || 'Present'}
                  </span>
                </div>
                
                {education.location && (
                  <div className="flex items-center gap-1 mb-1">
                    <FaMapMarkerAlt className="text-xs" />
                    <span>{education.location}</span>
                  </div>
                )}
                
                {education.gpa && (
                  <div className="font-medium text-green-600">
                    GPA: {education.gpa}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
