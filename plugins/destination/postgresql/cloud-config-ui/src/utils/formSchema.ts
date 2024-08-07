import { resetYupDefaultErrorMessages } from '@cloudquery/cloud-ui';
import { generateName } from '@cloudquery/plugin-config-ui-lib';
import * as yup from 'yup';

export const connectionTypeValues = ['string', 'fields'] as const;

export const sslModeValues = [
  'allow',
  'disable',
  'prefer',
  'require',
  'verify-ca',
  'verify-full',
] as const;
export const pgxLogLevelValues = ['error', 'warn', 'info', 'debug', 'trace'] as const;
export const migrateModeValues = ['forced', 'safe'] as const;
export const writeModeValues = ['append', 'overwrite', 'overwrite-delete-stale'] as const;

resetYupDefaultErrorMessages(yup);

export const formValidationSchema = yup.object({
  name: yup
    .string()
    .default(generateName('postgresql'))
    .matches(
      /^[a-z](-?[\da-z]+)+$/,
      'Name must consist of a lower case letter, followed by alphanumeric segments separated by single dashes',
    )
    .max(255)
    .required(),
  envs: yup
    .array()
    .of(
      yup.object({
        name: yup.string().default('').required(),
        value: yup.string().default(''),
      }),
    )
    .default([]),
  connectionType: yup.string().oneOf(connectionTypeValues).default('fields').required(),
  connectionString: yup
    .string()
    .default('')
    .when('connectionType', {
      is: 'string',
      // eslint-disable-next-line unicorn/no-thenable
      then: (schema) => schema.required(),
    }),
  username: yup.string().max(63).default(''),
  password: yup.string().max(63).default(''),
  host: yup
    .string()
    .max(253)
    .default('')
    .when('connectionType', {
      is: 'fields',
      // eslint-disable-next-line unicorn/no-thenable
      then: (schema) => schema.required(),
    }),
  port: yup
    .string()
    .max(5)
    .matches(/^($)|(\d+)$/, 'Port must be a number')
    .default(''),
  database: yup
    .string()
    .max(63)
    .default('')
    .when('connectionType', {
      is: 'fields',
      // eslint-disable-next-line unicorn/no-thenable
      then: (schema) => schema.required(),
    }),
  ssl: yup.bool().default(true),
  sslMode: yup.string().oneOf(sslModeValues).default('require'),
  schemaName: yup.string().default(''),
  pgxLogLevel: yup.string().oneOf(pgxLogLevelValues).default('error').required(),
  batchSize: yup.number().integer().default(10_000).required(),
  batchSizeBytes: yup.number().integer().default(100_000_000).required(),
  batchTimeout: yup.string().default('60s').required(),
  migrateMode: yup.string().oneOf(migrateModeValues).default('safe').required(),
  writeMode: yup.string().oneOf(writeModeValues).default('overwrite-delete-stale').required(),
});

export type FormValues = yup.InferType<typeof formValidationSchema>;
