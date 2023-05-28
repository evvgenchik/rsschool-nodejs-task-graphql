import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changePostBodySchema, createPostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { isValidUuid } from '../helper';
//changePostBodySchema
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await this.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      const post = await this.db.posts.findOne({
        key: 'id',
        equals: id,
      });

      if (!post) {
        throw fastify.httpErrors.createError(
          404,
          'This profile does not exist!'
        );
      }
      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = request.body as PostEntity;

      if (!isValidUuid(postEntity.userId)) {
        throw fastify.httpErrors.createError(
          400,
          'This memberTypeId does not correct'
        );
      }

      const post = await this.db.posts.create(postEntity);
      return post;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const post = await this.db.posts.delete(id);

      return post;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postEntity = request.body as PostEntity;
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const post = await this.db.posts.change(id, postEntity);

      return post;
    }
  );
};

export default plugin;
