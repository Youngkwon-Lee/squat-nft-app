const LDID_KEY = 'squat_nft_ldid';

export const generateLDID = (): string => {
  const random = Math.random().toString(36).substring(2, 9);
  return `LDID-${random}`;
};

export const getOrCreateLDID = (): string => {
  const storedLDID = localStorage.getItem(LDID_KEY);
  
  if (storedLDID) {
    return storedLDID;
  }
  
  const newLDID = generateLDID();
  localStorage.setItem(LDID_KEY, newLDID);
  return newLDID;
};

export const getLDID = (): string | null => {
  return localStorage.getItem(LDID_KEY);
};

export const clearLDID = (): void => {
  localStorage.removeItem(LDID_KEY);
}; 