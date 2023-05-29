import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';

const userCreateArgs = {
  firstName: { type: new GraphQLNonNull(GraphQLString) },
  lastName: { type: new GraphQLNonNull(GraphQLString) },
  email: { type: new GraphQLNonNull(GraphQLString) },
};
const userUpdateArgs = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  firstName: { type: new GraphQLNonNull(GraphQLString) },
  lastName: { type: new GraphQLNonNull(GraphQLString) },
  email: { type: new GraphQLNonNull(GraphQLString) },
};
const createProfileArgs = {
  avatar: { type: GraphQLString },
  sex: { type: GraphQLString },
  birthday: { type: GraphQLString },
  country: { type: GraphQLString },
  street: { type: GraphQLString },
  city: { type: GraphQLString },
  memberTypeId: { type: GraphQLString },
  userId: { type: GraphQLString },
};
const updateProfileArgs = {
  id: { type: GraphQLID },
  avatar: { type: GraphQLString },
  sex: { type: GraphQLString },
  birthday: { type: GraphQLString },
  country: { type: GraphQLString },
  street: { type: GraphQLString },
  city: { type: GraphQLString },
  memberTypeId: { type: GraphQLString },
  userId: { type: GraphQLString },
};
const createPost = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  userId: { type: GraphQLString },
};
const updatePost = {
  id: { type: GraphQLID },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  userId: { type: GraphQLString },
};

export {
  userCreateArgs,
  userUpdateArgs,
  createProfileArgs,
  updateProfileArgs,
  createPost,
  updatePost,
};
