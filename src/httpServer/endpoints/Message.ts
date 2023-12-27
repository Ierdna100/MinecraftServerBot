import { Request, Response } from "express";
import { BaseResponse } from "../BaseGetEndpoint.js";
import { EndpointTypes } from "../EndpointType.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { UUID } from "../../dto/UUID.js";
import { Application } from "../../Application.js";

class HttpHandler_Message implements BaseResponse {
    public endpointType = EndpointTypes.POST;
    public endpoint = "/msg";

    public handleResponse(req: Request, res: Response): void {
        let content: MinecraftServerInteraction.Message = {
            timestamp: new Date(req.body.timestamp),
            sender: new UUID(req.body.sender),
            message: req.body.message
        }

        Application.instance.collections.games.insertOne(content);

        // Application.instance.discordServer.publicLogChannel.send(content.transformed());

        Application.instance.logger.info(`${content.sender.uuid} sent message \"${content.message}\"`);

        res.status(200).send();
    }
    
}

export default HttpHandler_Message;
