const { HttpLogger, HttpMessage, HttpRequestImpl, HttpResponseImpl } = require('resurfaceio-logger');
const { URL } = require('url');

const logger = new HttpLogger({url: "http://localhost:4001/message", rules: "include debug"});
const request = new HttpRequestImpl();
const response = new HttpResponseImpl();
const started;

module.exports.requestHooks = [
    context => {
        started = logger.hrmillis;
        const url = new URL(context.request.getUrl());
        request.protocol = url.protocol.split(':')[0];
        request.hostname = url.host;
        request.url = url.pathname + url.search;
        context.request.getHeaders().forEach(header => {
            request.addHeader(header.name, header.value);
        });
        context.request.getParameters().forEach(param => {
            request.addQueryParam(param.name, param.value);
        });
        request.method = context.request.getMethod();
        // request.body = context.request.getBody().text;
        // HttpMessage.send(logger, request);
    }
];

module.exports.responseHooks = [
    context => {
        response.statusCode = context.response.getStatusCode();
        // const response_body = context.response.getBody();
        const now = Date.now().toString();
        const interval = (logger.hrmillis - started).toString();
        // HttpMessage.send(logger, request, response, response_body, request.body, now, interval);
        HttpMessage.send(logger, request, response, undefined, undefined, now, interval);
    }
];