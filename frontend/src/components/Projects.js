import React from 'react';
import { FaExternalLinkAlt, FaGithub, FaCog } from 'react-icons/fa';

const Projects = ({ data, formatDate }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="section-card slide-in">
      <h2 className="section-title">Projects</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((project, index) => (
          <div 
            key={project.id} 
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {project.project_name}
              </h3>
              
              <div className="flex gap-2">
                {project.project_url && (
                  <a 
                    href={project.project_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Project"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
                
                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                    title="View Code"
                  >
                    <FaGithub />
                  </a>
                )}
              </div>
            </div>

            {project.description && (
              <p className="text-gray-700 mb-3 leading-relaxed">
                {project.description}
              </p>
            )}

            {project.technologies && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <FaCog className="text-sm text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Technologies:</span>
                </div>
                <p className="text-sm text-gray-600">{project.technologies}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
