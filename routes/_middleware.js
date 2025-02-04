import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

import {
	HttpError,
	HttpUnprocessableEntityError,
	define
} from "./(__common)/_exports.js";
import { loggerMiddleware } from "./(_middleware)/_exports.js";

/**
 *
 * @param context
 * @param {...any} args
 * @param {...any} arguments_
 * @example
 */
const handler = define.middleware(
	[
		loggerMiddleware,
		async (context) => {
			try {
				return await context.next();
			}
			catch (error) {
				if (error instanceof ZodError) {
					const validationError = fromError(error);

					return new Response(
						validationError.toString(),
						{
							status: 400
						}
					);
				}

				throw error;
			}
		},
		async (context) => {
			try {
				return await context.next();
			}
			catch (error) {
				if (error instanceof HttpError) {
					return new Response(
						error.message,
						{
							headers: new Headers({
								Accept: error instanceof HttpUnprocessableEntityError
									? "application/json"
									: "*/*"
							}),
							status: error.status
						}
					);
				}

				throw error;
			}
		},
		async (context) => {
			const {
				request: {
					body
				},
				url: {
					pathname
				}
			} = context;

			if (body !== null && pathname.startsWith("/api")) {
				try {
					return await context.next();
				}
				catch (error) {
					if (error instanceof SyntaxError) {
						throw new HttpUnprocessableEntityError();
					}

					throw error;
				}
			}

			return await context.next();
		}
	]
);

export { handler };
