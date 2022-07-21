import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUserUseCase } from "./ResetPasswordUserUseCase";

class ResetPasswordUserController {
    async handle(request: Request, response: Response): Promise<Response> {

        const { token } = request.query

        const resetPasswordUserUseCase = container.resolve(ResetPasswordUserUseCase)
        await resetPasswordUserUseCase.execute({ token, })
        return response.send()
    }
}

export { ResetPasswordUserController }