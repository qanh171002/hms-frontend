// Helper functions for role management
export const getPrimaryRole = (user) => {
  return user?.roles?.[0] || null;
};

export const hasRole = (user, role) => {
  return user?.roles?.includes(role) || false;
};

export const hasAnyRole = (user, roles) => {
  return roles.some((role) => user?.roles?.includes(role));
};
