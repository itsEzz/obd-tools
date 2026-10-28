import { version } from '$app/env';
import { createDocument, createSchema } from 'zod-openapi';
import { m } from './paraglide/messages';
import {
	badRequestResponseSchema,
	internalServerErrorResponseSchema,
	tooManyRequestsResponseSchema
} from './schemas/api';
import {
	backupConverterApiResponseSchema,
	backupConverterApiSchema
} from './schemas/backup-converter';
import { codingCompareApiResponseSchema, codingCompareApiSchema } from './schemas/coding-compare';
import { hexToBinaryApiResponseSchema, hexToBinaryApiSchema } from './schemas/hex-to-binary';
import { prCodesApiResponseSchema, prCodesApiSchema } from './schemas/pr-codes';
import { svmApiResponseSchema, svmApiSchema } from './schemas/svm';

export const openApiDocument = createDocument({
	openapi: '3.1.1',
	info: {
		title: m.openapi_title(),
		version,
		description: m.openapi_description()
	},
	servers: [{ url: '/api' }],
	components: {
		schemas: {
			SVMBody: createSchema(svmApiSchema, { io: 'input' }).schema,
			SVMResponse: svmApiResponseSchema,
			CodingCompareBody: createSchema(codingCompareApiSchema, { io: 'input' }).schema,
			CodingCompareResponse: codingCompareApiResponseSchema,
			HexToBinaryBody: createSchema(hexToBinaryApiSchema, { io: 'input' }).schema,
			HexToBinaryResponse: hexToBinaryApiResponseSchema,
			PRCodesBody: createSchema(prCodesApiSchema, { io: 'input' }).schema,
			PRCodesResponse: prCodesApiResponseSchema,
			BackupConverterBody: createSchema(backupConverterApiSchema, { io: 'input' }).schema,
			BackupConverterResponse: backupConverterApiResponseSchema,
			BadRequestResponse: badRequestResponseSchema,
			TooManyRequestsResponse: tooManyRequestsResponseSchema,
			InternalServerErrorResponse: internalServerErrorResponseSchema
		},
		responses: {
			'400': {
				description: m.openapi_bad_request_response_description(),
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/BadRequestResponse' }
					}
				}
			},
			'429': {
				description: m.openapi_too_many_requests_response_description(),
				content: {
					'text/plain': {
						schema: { $ref: '#/components/schemas/TooManyRequestsResponse' }
					}
				}
			},
			'500': {
				description: m.openapi_internal_server_error_response_description(),
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/InternalServerErrorResponse' }
					}
				}
			}
		}
	},
	paths: {
		'/svm': {
			post: {
				summary: m.navbar_svm_label(),
				requestBody: {
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/SVMBody' }
						}
					}
				},
				responses: {
					'200': {
						description: m.openapi_success_response_description(),
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SVMResponse' }
							}
						}
					},
					'400': { $ref: '#/components/responses/400' },
					'429': { $ref: '#/components/responses/429' },
					'500': { $ref: '#/components/responses/500' }
				}
			}
		},
		'/cc': {
			post: {
				summary: m.navbar_coding_compare_label(),
				requestBody: {
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CodingCompareBody' }
						}
					}
				},
				responses: {
					'200': {
						description: m.openapi_success_response_description(),
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CodingCompareResponse' }
							}
						}
					},
					'400': { $ref: '#/components/responses/400' },
					'429': { $ref: '#/components/responses/429' },
					'500': { $ref: '#/components/responses/500' }
				}
			}
		},

		'/htb': {
			post: {
				summary: m.navbar_hex_to_binary_label(),
				requestBody: {
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/HexToBinaryBody' }
						}
					}
				},
				responses: {
					'200': {
						description: m.openapi_success_response_description(),
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/HexToBinaryResponse' }
							}
						}
					},
					'400': { $ref: '#/components/responses/400' },
					'429': { $ref: '#/components/responses/429' },
					'500': { $ref: '#/components/responses/500' }
				}
			}
		},
		'/prl': {
			post: {
				summary: m.navbar_pr_codes_lookup_label(),
				requestBody: {
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/PRCodesBody' }
						}
					}
				},
				responses: {
					'200': {
						description: m.openapi_success_response_description(),
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PRCodesResponse' }
							}
						}
					},
					'400': { $ref: '#/components/responses/400' },
					'429': { $ref: '#/components/responses/429' },
					'500': { $ref: '#/components/responses/500' }
				}
			}
		},
		bc: {
			post: {
				summary: m.navbar_backup_converter_label(),
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: { $ref: '#/components/schemas/BackupConverterBody' }
						}
					}
				},
				responses: {
					'200': {
						description: m.openapi_success_response_description(),
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/BackupConverterResponse' }
							}
						}
					},
					'400': { $ref: '#/components/responses/400' },
					'429': { $ref: '#/components/responses/429' },
					'500': { $ref: '#/components/responses/500' }
				}
			}
		}
	}
});
