import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { HttpError } from '@fastify/sensible/lib/httpError';

const isValidUuid = (code: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(code);
};

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const params = request.params as { id: string };
      const id = params.id;

      const user = await this.db.users.findOne({
        key: 'id',
        equals: id,
      });

      if (!user) {
        throw fastify.httpErrors.createError(404, 'This user does not exist!');
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.create(request.body as UserEntity);

      return user;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const user = await this.db.users.delete(id);
      return user;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const user = await this.db.users.change(id, {
        subscribedToUserIds: request.body.userId,
      });

      return user;
    }
  );

  // fastify.post(
  //   '/:id/unsubscribeFrom',
  //   {
  //     schema: {
  //       body: subscribeBodySchema,
  //       params: idParamSchema,
  //     },
  //   },
  //   async function (request, reply): Promise<UserEntity> {}
  // );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const user = await this.db.users.change(id, request.body as Object);

      return user;
    }
  );
};

export default plugin;
