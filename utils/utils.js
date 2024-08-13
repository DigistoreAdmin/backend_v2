

exports.sendOkResponse = (res, status, data, message = "empty string") => {
    res.status(status);
    res.json({
        status,
        data,
        message
    });
}

exports.sendErrorResponse = (res, status, message = "empty string", error = "empty string") => {
    res.status(status);
    res.json({
        status,
        message,
        error
    });
}