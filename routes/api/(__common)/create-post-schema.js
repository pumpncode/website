/* eslint-disable import-x/no-cycle */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { camel } from "@radashi-org/radashi";
import { Table } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/database/schema.js";

import createPatchSchema from "./create-patch-schema.js";

const allTables = Object.entries(schema)
	.filter(([key, innerTable]) => innerTable instanceof Table);

/**
 * @param {Table} table
 * @param {object} [options] - The root object
 * @param {string[]} [options.from] - The root object
 * @example
 */
const createPostSchema = (table, { from = [] } = {}) => {
	const insertSchema = createInsertSchema(table)
		.strict();

	const basePatchSchema = from.length === 0
		? insertSchema.omit({
			id: true
		})
		: insertSchema;

	const {
		foreignKeys,
		name: tableName
	} = getTableConfig(table);

	const basePatchSchemaWithoutTimestampColumns = basePatchSchema
		.omit({
			createdAt: true,
			updatedAt: true
		});

	const foreignKeyEntries = foreignKeys
		.map((foreignKey) => {
			const {
				columns: [{ name: columnName }],
				foreignColumns: [{ name: foreignColumnName }],
				foreignTable
			} = foreignKey.reference();

			const {
				name: foreignTableName
			} = getTableConfig(foreignTable);

			return {
				columnName: camel(columnName),
				foreignTableName: camel(foreignTableName),
				name: camel(columnName.replace(new RegExp(`_${foreignColumnName}$`, "v"), ""))
			};
		});

	const basePatchSchemaWithoutRelations = basePatchSchemaWithoutTimestampColumns
		.omit(
			Object.fromEntries(
				foreignKeyEntries
					.map(({ columnName }) => [columnName, true])
			)
		);

	let schemaWithoutManyRelations = basePatchSchemaWithoutRelations;

	for (const {
		columnName, foreignTableName, name
	} of foreignKeyEntries) {
		const schemaTableKey = `${camel(foreignTableName)}Table`;

		const schemaTable = schema[schemaTableKey];

		const schemaFunctions = [createPatchSchema, createPostSchema];

		const subSchemas = schemaFunctions
			.map((createSchemaFunction) => createSchemaFunction(
				schemaTable,
				{
					from: [...from, tableName]
				}
			));

		schemaWithoutManyRelations = (from !== undefined && from.includes(foreignTableName))
			? schemaWithoutManyRelations
			: schemaWithoutManyRelations
				.partial()
				.merge(
					z.object({
						[columnName]: basePatchSchema.shape[columnName],
						[name]: z.union(subSchemas)
					})
						.partial()
				)
				.strict();
	}

	const manyRelations = allTables
		.flatMap(([tableKey, innerTable]) => {
			const {
				foreignKeys: innerForeignKeys,
				name: innerTableName
			} = getTableConfig(innerTable);

			return innerForeignKeys
				.map((foreignKey) => {
					const {
						columns: [{ name: columnName }],
						foreignColumns: [{ name: foreignColumnName }],
						foreignTable
					} = foreignKey.reference();

					const {
						name: foreignTableName
					} = getTableConfig(foreignTable);

					return {
						columnName: camel(columnName),
						foreignTableName: camel(foreignTableName),
						name: camel(columnName.replace(new RegExp(`_${foreignColumnName}$`, "v"), "")),
						tableName: innerTableName
					};
				})
				.filter(({ foreignTableName }) => foreignTableName === tableName);
		})
		.filter(({ tableName: innerTableName }) => (from !== undefined && !from.includes(innerTableName)));

	let finalSchema = schemaWithoutManyRelations;

	for (const { tableName: innerTableName } of manyRelations) {
		const schemaTableKey = `${camel(innerTableName)}Table`;

		const schemaTable = schema[schemaTableKey];

		const schemaFunctions = [createPatchSchema, createPostSchema];

		const subSchemas = schemaFunctions
			.map((createSchemaFunction) => createSchemaFunction(
				schemaTable,
				{
					from: [...from, tableName]
				}
			));

		finalSchema = finalSchema
			.merge(
				z.object({
					[innerTableName]: z.array(z.union(subSchemas))
				})
					.partial()
			)
			.strict();
	}

	finalSchema = finalSchema.strict();

	return finalSchema
		.merge(
			z.object({
				id: insertSchema.shape.id.optional()
			})
				.strict()
		)
		.strict()
		.superRefine((data, context) => {
			for (const { columnName, name } of foreignKeyEntries) {
				if (data[name] && data[columnName]) {
					context.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Only one of ${name} or ${name}Id should be set`,
						path: [columnName]
					});
				}

				if (!data[name] && !data[columnName]) {
					context.addIssue({
						code: z.ZodIssueCode.custom,
						message: `One of ${name} or ${name}Id should be set`,
						path: [columnName]
					});
				}
			}
		});
};

export default createPostSchema;
