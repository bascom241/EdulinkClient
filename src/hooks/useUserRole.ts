// hooks/useUserRole.ts
import { useState, useEffect } from 'react';

type UserRole = 'ROLE_TEACHER' | 'ROLE_USER';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('ROLE_USER');

  useEffect(() => {
    const userRole = localStorage.getItem('role') as UserRole;
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  return {
    role,
    isTeacher: role === 'ROLE_TEACHER',
    isStudent: role === 'ROLE_USER'
  };
};