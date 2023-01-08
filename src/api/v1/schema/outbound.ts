import { FastifySchema } from "fastify";

export const onSettingsResponseSchema: FastifySchema = {
	body: {
		type: "object",

		properties: {
			success: "boolean",
			message: "string",

			settings: {
				type: "array"
			}
		}
	}
};

export const onUploadResponseSchema: FastifySchema = {
	body: {
		type: "object",

		properties: {
			success: "boolean",
			message: "string"
		}
	}
};

export const onActionResponseSchema: FastifySchema = {
	body: {
		type: "object",

		properties: {
			success: "boolean",
			message: "string"
		}
	}
};

export const onIdentifyResponseSchema: FastifySchema = {
	body: {
		type: "object",

		properties: {
			success: "boolean",
			message: "string"
		}
	}
};