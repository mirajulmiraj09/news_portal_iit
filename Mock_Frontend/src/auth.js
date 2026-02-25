export const saveUser = (user) => {
  localStorage.setItem("news_user", JSON.stringify(user));
};

export const getUser = () => {
  const v = localStorage.getItem("news_user");
  return v ? JSON.parse(v) : null;
};

export const logout = () => {
  localStorage.removeItem("news_user");
};
