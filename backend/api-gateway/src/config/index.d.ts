export declare const config: {
    port: string | number;
    nodeEnv: string;
    jwt: {
        secret: string;
        accessExpiry: string;
        refreshExpiry: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    cors: {
        origin: string[];
        credentials: boolean;
    };
    services: {
        userService: string;
        productService: string;
        orderService: string;
        paymentService: string;
        notificationService: string;
        chatService: string;
        searchService: string;
        analyticsService: string;
    };
    redis: {
        url: string;
    };
    app: {
        name: string;
        frontendUrl: string;
    };
};
//# sourceMappingURL=index.d.ts.map