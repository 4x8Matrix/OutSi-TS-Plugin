import { FastifySchema } from "fastify";

export const onUploadRequestedSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["batch"],

		properties: {
			batch: {
				type: "array",

				maxItems: 1000,
				minItems: 1,

				items: {
					type: "object",
					required: ["MessageType", "Message", "RepeatCount"],

					properties: {
						MessageType: {
							type: "number",
							
							minimum: 0,
							maximum: 3
						},

						Message: { type: "string" },
						RepeatCount: { type: "number" },
					}
				}
			}
		},
	}
};

export const onActionRequestedSchema: FastifySchema = {
	body: {
		type: 'object',
		required: ["actionType"],
		properties: {
			actionType: {
				type: "number",
				
				minimum: 0,
				maximum: 3
			}
		}
	}
};

export const onIdentifyRequestedSchema: FastifySchema = { };
export const onSettingsRequestedSchema: FastifySchema = { };