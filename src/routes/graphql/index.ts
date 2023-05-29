import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { memberType, userType, postType, profileType } from './graphqlTypes';
import {
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
} from 'graphql';
import {
  createPost,
  createProfileArgs,
  updatePost,
  updateProfileArgs,
  userCreateArgs,
  userUpdateArgs,
} from './graphqlArgTypes';

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
              ...userCreateArgs,
            },
            async resolve(parent, args) {
              return await fastify.db.users.create(args);
            },
          },
          updateUser: {
            type: userType,
            args: {
              ...userUpdateArgs,
            },
            async resolve(parent, args) {
              return await fastify.db.users.change(args.id, args);
            },
          },
          createProfile: {
            type: profileType,
            args: {
              ...createProfileArgs,
            },
            async resolve(parent, args) {
              return await fastify.db.profiles.create(args);
            },
          },
          updateProfiile: {
            type: profileType,
            args: {
              ...updateProfileArgs,
            },
            async resolve(parent, args) {
              return await fastify.db.profiles.change(args.id, args);
            },
          },
          createPost: {
            type: postType,
            args: {
              ...createPost,
            },
            async resolve(parent, args) {
              return await fastify.db.posts.create(args);
            },
          },
          updatePost: {
            type: postType,
            args: {
              ...updatePost,
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

export default plugin;
