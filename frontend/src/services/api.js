import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const resumeAPI = {
  // Get complete resume data
  getCompleteResume: async () => {
    try {
      const response = await api.get('/resume');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch complete resume: ${error.message}`);
    }
  },

  // Get personal information
  getPersonalInfo: async () => {
    try {
      const response = await api.get('/personal-info');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personal info: ${error.message}`);
    }
  },

  // Get all experience
  getExperience: async () => {
    try {
      const response = await api.get('/experience');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch experience: ${error.message}`);
    }
  },

  // Get specific experience by ID
  getExperienceById: async (id) => {
    try {
      const response = await api.get(`/experience/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch experience ${id}: ${error.message}`);
    }
  },

  // Get education
  getEducation: async () => {
    try {
      const response = await api.get('/education');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch education: ${error.message}`);
    }
  },

  // Get skills
  getSkills: async () => {
    try {
      const response = await api.get('/skills');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }
  },

  // Get projects
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  },

  // Get certifications
  getCertifications: async () => {
    try {
      const response = await api.get('/certifications');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch certifications: ${error.message}`);
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};

export default api;
