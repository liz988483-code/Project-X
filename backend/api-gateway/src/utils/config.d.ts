export declare const config: {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    gateway: {
        port: number;
        host: string;
        rateLimit: {
            windowMs: number;
            max: number;
        };
    };
    services: {
        userService: string;
        productService: string;
        orderService: string;
        cartService: string;
        paymentService: string;
        notificationService: string;
    };
    app: {
        env: string;
        name: string;
        allowedOrigins: string[];
    };
    redis: {
        url: string;
        ttl: number;
    };
    logging: {
        level: string;
        dir: string;
    };
};
export declare const validateConfig: () => void;
//# sourceMappingURL=config.d.ts.map