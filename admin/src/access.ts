export default (initialState: { currentUser?: API.User }) => {
  const { currentUser } = initialState ?? {};
  const admin = currentUser && currentUser.roles.includes('admin');
  return {
    admin
  };
};
