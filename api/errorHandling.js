import { serializeError } from "serialize-error";

export function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

export function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: serializeError(err) });
    } else {
        next(err);
    }
}

export function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

