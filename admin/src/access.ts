export default (initialState: { currentUser?: API.User }) => {
  const { currentUser } = initialState ?? {};
  const canAdmin = currentUser && currentUser.roles.includes('admin');
  return {
    canAdmin
  };
};
