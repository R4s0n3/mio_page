export type CheckoutValidationResult =
  | {
      status: "paid";
      orderId: string;
      paymentReference: string;
      customerEmail?: string | null;
      emailSent: boolean;
      message: string;
    }
  | {
      status: "pending";
      orderId: string;
      paymentReference: string;
      message: string;
    }
  | {
      status: "cancelled";
      orderId?: string;
      paymentReference?: string;
      message: string;
    }
  | {
      status: "invalid";
      orderId?: string;
      paymentReference?: string;
      message: string;
    };
