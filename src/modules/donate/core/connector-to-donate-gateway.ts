export interface ConnectorToDonateGateway {
    createPaymentIntent(amount: number): Promise<{ clientSecret: string }>;
    createCheckoutSession(amount: number, email: string): Promise<string>;
}
