import logger from "../logger"

export const logInfo = (req, message) => {
  logger.info({message, interactionId: req.headers.interactionId})
}