const isValidMemberType = (type) => {
  return type === 'basic' || type === 'business';
};

const ob = {
  id: 2,
  discount: 2,
  monthPostsLimit: 3,
};

console.log(isValidMemberType('fakeid'));
