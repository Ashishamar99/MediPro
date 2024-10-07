const { v4: uuidv4, validate: uuidValidate } = require('uuid');

export default function assignInteractionId(req, res, next) {
    let interactionId = req.headers['interactionId'];
    if(!interactionId) {
        interactionId = uuidv4()
        req.headers.interactionId = interactionId
    }

    res.setHeader('interactionId', interactionId);
    next()
}