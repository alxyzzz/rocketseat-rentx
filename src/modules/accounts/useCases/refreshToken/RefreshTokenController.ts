import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUSeCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
    async handle(request: Request, response: Response): Promise<Response> {
        const token = request.body.token || request.headers["x-access-token"] || request.query.token

        const refreshTokenUseCase = container.resolve(RefreshTokenUSeCase)

        const refreshToken = await refreshTokenUseCase.execute(token)

        return response.json(refreshToken)
    }
}

export { RefreshTokenController }