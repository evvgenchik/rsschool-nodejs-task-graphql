import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await this.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const params = request.params as { id: string };
      const id = params.id;

      const memberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: id,
      });

      if (!memberType) {
        throw fastify.httpErrors.createError(
          404,
          'This profile does not exist!'
        );
      }
      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberEntity = request.body as MemberTypeEntity;
      const params = request.params as { id: string };
      const id = params.id;

      const prevMemberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: id,
      });

      if (!prevMemberType) {
        throw fastify.httpErrors.createError(
          400,
          'This profile does not exist!'
        );
      }

      const memberType = await this.db.memberTypes.change(id, memberEntity);
      return memberType;
    }
  );
};

export default plugin;
