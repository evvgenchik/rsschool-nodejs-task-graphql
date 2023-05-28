const isValidUuid = (code: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(code);
};
const isValidMemberType = (type: string) => {
  return type === 'basic' || type === 'business';
  // const validKeys = ['discount', 'monthPostsLimit'];
  // const currentKeys = Object.keys(obj);
  // return validKeys.every((el) => currentKeys.includes(el));
};

export { isValidUuid, isValidMemberType };
