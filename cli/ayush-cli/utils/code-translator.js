import axios from 'axios';
import api from './api.js';

const rootApi = axios.create({
    baseURL: 'http://3.26.95.153:8080',
});

export const translateIcdToTraditional = async (icdCode) => {
  try {
    const response = await api.get(`/conceptmaps/translate/icd/${icdCode}`);
    return response.data;
  } catch (error) {
    console.error('Error translating ICD code:', error.message);
    return null;
  }
};

export const translateTraditionalToIcd = async (traditionalCode) => {
  try {
    const response = await api.get(`/conceptmaps/translate/traditional/${traditionalCode}`);
    return response.data;
  } catch (error) {
    console.error('Error translating traditional code:', error.message);
    return null;
  }
};

export const getAllConceptMaps = async () => {
  try {
    const response = await api.get('/conceptmaps/all');
    return response.data;
  } catch (error) {
    console.error('Error getting all concept maps:', error.message);
    return null;
  }
};

export const lookupCode = async (system, code) => {
  try {
    const response = await api.get(`/codesystem/lookup?system=${system}&code=${code}`);
    return response.data;
  } catch (error) {
    console.error('Error looking up code:', error.message);
    return null;
  }
};

export const getTestMessage = async () => {
  try {
    const response = await api.get('/conceptmaps/test');
    return response.data;
  } catch (error) {
    console.error('Error getting test message:', error.message);
    return null;
  }
};

export const getCodeSystemsOverview = async () => {
    try {
      const response = await api.get('/codesystem/all');
      return response.data;
    } catch (error) {
      console.error('Error getting code systems overview:', error.message);
      return null;
    }
  };
  
  export const getFhirCodeSystems = async () => {
    try {
      const response = await api.get('/fhir/CodeSystem');
      return response.data;
    } catch (error) {
      console.error('Error getting FHIR code systems:', error.message);
      return null;
    }
  };
  
  export const getFhirCodeSystemById = async (id) => {
    try {
      const response = await api.get(`/fhir/CodeSystem/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting FHIR code system by id ${id}:`, error.message);
      return null;
    }
  };
  
  export const getDbTest = async () => {
    try {
      const response = await rootApi.get('/test-db');
      return response.data;
    } catch (error) {
      console.error('Error testing db:', error.message);
      return null;
    }
  };
  
  export const getHealthCheck = async () => {
    try {
      const response = await rootApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error health checking:', error.message);
      return null;
    }
  };