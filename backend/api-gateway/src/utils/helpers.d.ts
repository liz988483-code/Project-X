export declare const generateId: () => string;
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const slugify: (text: string) => string;
export declare const validateEmail: (email: string) => boolean;
export declare const sanitizeInput: (input: string) => string;
export declare const paginate: (items: any[], page?: number, limit?: number) => {
    results: any[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
//# sourceMappingURL=helpers.d.ts.map