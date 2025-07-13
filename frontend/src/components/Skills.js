import React from 'react';

const Skills = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const getProficiencyClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'beginner';
      case 'intermediate':
        return 'intermediate';
      case 'advanced':
        return 'advanced';
      case 'expert':
        return 'expert';
      default:
        return 'intermediate';
    }
  };

  return (
    <div className="section-card slide-in">
      <h2 className="section-title">Skills & Technologies</h2>
      
      <div className="space-y-6">
        {Object.entries(data).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
              {category}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={skill.id || index}
                  className={`skill-badge ${getProficiencyClass(skill.proficiency_level)}`}
                  title={`${skill.skill_name} - ${skill.proficiency_level || 'Intermediate'}`}
                >
                  {skill.skill_name}
                  <span className="ml-1 text-xs opacity-75">
                    ({skill.proficiency_level || 'Intermediate'})
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Proficiency Levels:</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="skill-badge beginner">Beginner</span>
          <span className="skill-badge intermediate">Intermediate</span>
          <span className="skill-badge advanced">Advanced</span>
          <span className="skill-badge expert">Expert</span>
        </div>
      </div>
    </div>
  );
};

export default Skills;
