import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Gender = 'male' | 'female';

interface GenderContextType {
  gender: Gender;
  setGender: (g: Gender) => void;
}

const GenderContext = createContext<GenderContextType>({
  gender: 'male',
  setGender: () => {},
});

export const useGender = () => useContext(GenderContext);

export const GenderProvider = ({ children }: { children: ReactNode }) => {
  const [gender, setGender] = useState<Gender>(() => {
    return (localStorage.getItem('preferred_gender') as Gender) || 'male';
  });

  useEffect(() => {
    localStorage.setItem('preferred_gender', gender);
    document.documentElement.setAttribute('data-gender', gender);
  }, [gender]);

  return (
    <GenderContext.Provider value={{ gender, setGender }}>
      {children}
    </GenderContext.Provider>
  );
};
