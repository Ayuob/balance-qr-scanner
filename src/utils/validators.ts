export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Basic phone number validation - can be adjusted based on requirements
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phoneNumber);
};