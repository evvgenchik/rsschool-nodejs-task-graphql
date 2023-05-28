import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeProfileBodySchema, createProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { isValidMemberType, isValidUuid } from '../helper';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      const profile = await this.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      if (!profile) {
        throw fastify.httpErrors.createError(404, 'This user does not exist!');
      }

      const author = await this.db.users.findOne({
        key: 'id',
        equals: profile.userId,
      });

      if (!author) {
        throw fastify.httpErrors.createError(
          404,
          'This profile does not exist!'
        );
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileEntity = request.body as ProfileEntity;

      if (!isValidMemberType(profileEntity.memberTypeId)) {
        throw fastify.httpErrors.createError(
          400,
          'This memberTypeId does not correct'
        );
      }

      const allProfiles = await this.db.profiles.findMany();
      const exisitingProfile = allProfiles.find(
        (el) => el.userId === profileEntity.userId
      );

      if (exisitingProfile) {
        throw fastify.httpErrors.createError(400, 'This profile already exist');
      }

      const profile = await this.db.profiles.create(profileEntity);
      return profile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const profile = await this.db.profiles.delete(id);
      return profile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileEntity = request.body as ProfileEntity;
      const params = request.params as { id: string };
      const id = params.id;

      if (!isValidUuid(id)) {
        throw fastify.httpErrors.createError(400, 'This id does not correct');
      }

      const profile = await this.db.profiles.change(id, profileEntity);

      return profile;
    }
  );
};

export default plugin;
