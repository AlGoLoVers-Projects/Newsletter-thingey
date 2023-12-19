import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app: any) {
    app.use(
        "/",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true,
        })
    );
};