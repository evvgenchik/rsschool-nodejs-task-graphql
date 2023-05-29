// import {
//   // GraphQLInputObjectType,
//   GraphQLList,
//   GraphQLID,
//   GraphQLString,
//   GraphQLSchema,
//   GraphQLObjectType,
// } from 'graphql';

// const schema = new GraphQLSchema({
//   query,
// });

// const userType = new GraphQLObjectType({
//   name: 'User',
//   fields: () => ({
//     id: { type: GraphQLID },
//     firstName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     email: { type: GraphQLString },
//     subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
//   }),
// });

// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     users: {
//       type: new GraphQLList(userType),
//       args: { id: { type: GraphQLID } },
//       async resolve(parent, args) {
//         return await DB.users.findMany();
//       },
//     },
//     user: {
//       type: userType,
//       args: { id: { type: GraphQLID } },
//       async resolve(parent, args) {
//         return await carController.getSingleCar(args);
//       },
//     },
//   },
// });

// export { schema };
