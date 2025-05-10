export declare function getCart(): Promise<any[]>;
export declare function updateCartItem(id: string, quantity: number): Promise<void>;
export declare function removeCartItem(id: string): Promise<void>;
export declare function checkoutCart(ids: string[]): Promise<void>;
