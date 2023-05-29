import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  // GraphQLInputObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const bodyRequest = request.body as any;
      const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          users: {
            type: new GraphQLList(userType),
            async resolve(parent, args) {
              return await fastify.db.users.findMany();
            },
          },
          user: {
            type: userType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.users.findOne(args);
            },
          },
          profiles: {
            type: new GraphQLList(profileType),
            async resolve(parent, args) {
              return await fastify.db.profiles.findMany();
            },
          },
          profile: {
            type: profileType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.profiles.findOne(args);
            },
          },
          posts: {
            type: new GraphQLList(postType),
            async resolve(parent, args) {
              return await fastify.db.posts.findMany();
            },
          },
          post: {
            type: postType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.posts.findOne(args);
            },
          },
          memberTypes: {
            type: new GraphQLList(memberType),
            async resolve(parent, args) {
              return await fastify.db.memberTypes.findMany();
            },
          },
          memberType: {
            type: memberType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.memberTypes.findOne(args);
            },
          },
        },
      });

      const Mutations = new GraphQLObjectType({
        name: 'Mutations',
        fields: {
          createUser: {
            type: userType,
            args: {
              firstName: { type: new GraphQLNonNull(GraphQLString) },
              lastName: { type: new GraphQLNonNull(GraphQLString) },
              email: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
              return await fastify.db.users.create(args);
            },
          },
          updateUser: {
            type: userType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              firstName: { type: new GraphQLNonNull(GraphQLString) },
              lastName: { type: new GraphQLNonNull(GraphQLString) },
              email: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
              return await fastify.db.users.change(args.id, args);
            },
          },
          createProfile: {
            type: profileType,
            args: {
              avatar: { type: GraphQLString },
              sex: { type: GraphQLString },
              birthday: { type: GraphQLString },
              country: { type: GraphQLString },
              street: { type: GraphQLString },
              city: { type: GraphQLString },
              memberTypeId: { type: GraphQLString },
              userId: { type: GraphQLString },
            },
            async resolve(parent, args) {
              return await fastify.db.profiles.create(args);
            },
          },
          updateProfiile: {
            type: profileType,
            args: {
              id: { type: GraphQLID },
              avatar: { type: GraphQLString },
              sex: { type: GraphQLString },
              birthday: { type: GraphQLString },
              country: { type: GraphQLString },
              street: { type: GraphQLString },
              city: { type: GraphQLString },
              memberTypeId: { type: GraphQLString },
              userId: { type: GraphQLString },
            },
            async resolve(parent, args) {
              return await fastify.db.profiles.change(args.id, args);
            },
          },
          createPost: {
            type: postType,
            args: {
              title: { type: GraphQLString },
              content: { type: GraphQLString },
              userId: { type: GraphQLString },
            },
            async resolve(parent, args) {
              return await fastify.db.posts.create(args);
            },
          },
          updatePost: {
            type: postType,
            args: {
              id: { type: GraphQLID },
              title: { type: GraphQLString },
              content: { type: GraphQLString },
              userId: { type: GraphQLString },
            },
            async resolve(parent, args) {
              return await fastify.db.posts.change(args.id, args);
            },
          },
          deleteUser: {
            type: userType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
              return await fastify.db.users.delete(args);
            },
          },
        },
      });

      const schema = new GraphQLSchema({
        query: RootQuery,
        mutation: Mutations,
      });

      const res = await graphql({
        schema,
        source: bodyRequest.query,
      });

      return res;
    }
  );
};

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
});
const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});
const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});
const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export default plugin;
