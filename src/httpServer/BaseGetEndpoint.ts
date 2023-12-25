import { EndpointTypes } from "./EndpointType.js";
import { Request, Response } from "express";

export abstract class BaseResponse {
    public abstract endpointType: EndpointTypes;
    public abstract endpoint: string;

    public abstract handleResponse(req: Request, res: Response): void;
}
