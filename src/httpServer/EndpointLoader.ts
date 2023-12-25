import fs from 'fs';
import { BaseResponse } from './BaseGetEndpoint.js';
import { EndpointTypes } from './EndpointType.js';
import { HttpServer } from './httpServer.js';

export class EndpointLoader {
    public async loadEndpoints() {
        const endpointFileNames = fs.readdirSync('./build/httpServer/endpoints/');

        for (const endpointFileName of endpointFileNames) {
            let endpointCctor: { default: new () => BaseResponse } = await import(`./endpoints/${endpointFileName}`);
            const endpoint: BaseResponse = new endpointCctor.default();

            if (endpoint.endpointType == EndpointTypes.GET) {
                HttpServer.instance.app.get(endpoint.endpoint, endpoint.handleResponse);
                console.log("A")
            }
            else if (endpoint.endpointType == EndpointTypes.POST) {
                HttpServer.instance.app.post(endpoint.endpoint, endpoint.handleResponse);
            }
            else {
                throw new Error("Unhandled endpoint type");
            }
        }
    }
}
