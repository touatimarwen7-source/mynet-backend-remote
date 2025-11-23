import { useState, useCallback } from 'react';

/**
 * Unified form state management hook for multi-step forms
 * Reduces boilerplate and ensures consistent state management
 */
export const useForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Generic field change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  }, []);

  // Handle nested field changes (e.g., evaluation_criteria.price)
  const handleNestedChange = useCallback((path, value) => {
    const keys = path.split('.');
    setFormData((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  }, []);

  // Step navigation
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setCurrentStep(0);
    setError('');
  }, [initialData]);

  // Clear error
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  return {
    // State
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,

    // Handlers
    handleChange,
    handleNestedChange,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetForm,
    clearError,
    updateFields,
  };
};
