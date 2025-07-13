import React from 'react';
import { FaCertificate, FaExternalLinkAlt, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';

const Certifications = ({ data, formatDate }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="section-card slide-in">
      <h2 className="section-title">Certifications</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((cert, index) => (
          <div 
            key={cert.id} 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaCertificate className="text-blue-600" />
                {cert.certification_name}
              </h3>
              
              {cert.credential_url && (
                <a 
                  href={cert.credential_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="View Credential"
                >
                  <FaExternalLinkAlt />
                </a>
              )}
            </div>

            <h4 className="text-md font-semibold text-blue-700 mb-3">
              {cert.issuing_organization}
            </h4>

            <div className="space-y-2 text-sm text-gray-600">
              {cert.issue_date && (
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-xs" />
                  <span>
                    Issued: {formatDate(cert.issue_date)}
                    {cert.expiration_date && (
                      <span className="ml-2">
                        | Expires: {formatDate(cert.expiration_date)}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {cert.credential_id && (
                <div className="flex items-center gap-1">
                  <FaIdBadge className="text-xs" />
                  <span>Credential ID: {cert.credential_id}</span>
                </div>
              )}
            </div>

            {/* Expiration warning */}
            {cert.expiration_date && (
              <div className="mt-3">
                {(() => {
                  const expirationDate = new Date(cert.expiration_date);
                  const today = new Date();
                  const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
                  
                  if (daysUntilExpiration < 0) {
                    return (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Expired
                      </span>
                    );
                  } else if (daysUntilExpiration < 30) {
                    return (
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Expires soon
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Valid
                      </span>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
