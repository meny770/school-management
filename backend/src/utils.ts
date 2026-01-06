import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export const errorHandler = (
	error: any,
	options: {
		filePath: string;
		functionName: string;
		errorStatusObject?: any;
		message?: string;
		title?: string;
		dontThrow?: boolean;
	}
) => {
	const {
		filePath,
		functionName,
		errorStatusObject,
		message,
		title,
		dontThrow,
	} = options;

	const errorObject = errorStatusObject || InternalServerErrorException;
	process.env.NODE_ENV === 'development'
		? console.error(error, filePath, functionName)
		: Logger.error(error, filePath, functionName);

	error?.response &&
		(error = {
			headers: error.response?.config?.headers,
			url: error.response?.config?.url,
			method: error.response?.config?.method,
			reqData: error.response?.config?.data,
			resData: error.response?.data,
			status: error.response?.status,
		});

	const data = {
		from: process.env.ERROR_MAIL_FROM,
		to: process.env.MAIL_TO,
		subject: title || 'Error',
		title: message,
		text: message,
		html: `<html> 
    <head>
    <title>${message}</title>
    </head>
    <body>
    <h1>Function name: ${functionName}</h1>
    <p>Status: &nbsp;<b> ${new errorObject().status}</b></p>
        <p>Message: &nbsp;<b> ${message}</b></h4>
        <p>Path: &nbsp;&nbsp;${filePath}</p>
        <h2>Content: </h2>
        ${Object.entries(error)
					.map(
						(item) =>
							`<p><b>${item[0]}: </b><br/>${JSON.stringify(item[1])}</p>`
					)
					.join(' ')}
            <p><b>Send to: &nbsp;&nbsp; ${process.env.MAIL_TO} </b>  
            </body>
            </html>`,
	};

	if (dontThrow) {
		return error;
	} else {
		throw new errorObject(message);
	}
};
