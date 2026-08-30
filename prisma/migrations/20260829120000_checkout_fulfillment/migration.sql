ALTER TABLE `Order`
  ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
  ADD COLUMN `stripeInvoiceId` VARCHAR(191) NULL,
  ADD COLUMN `invoiceNumber` VARCHAR(191) NULL,
  ADD COLUMN `invoiceUrl` TEXT NULL,
  ADD COLUMN `invoicePdfUrl` TEXT NULL,
  ADD COLUMN `paidAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `Order_stripeInvoiceId_key` ON `Order`(`stripeInvoiceId`);

ALTER TABLE `Shipping`
  ADD COLUMN `city` VARCHAR(191) NULL,
  ADD COLUMN `state` VARCHAR(191) NULL;

ALTER TABLE `SponsorBid`
  ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
  ADD COLUMN `stripeInvoiceId` VARCHAR(191) NULL,
  ADD COLUMN `stripeRefundId` VARCHAR(191) NULL,
  ADD COLUMN `stripeCreditNoteId` VARCHAR(191) NULL,
  ADD COLUMN `invoiceNumber` VARCHAR(191) NULL,
  ADD COLUMN `invoiceUrl` TEXT NULL,
  ADD COLUMN `invoicePdfUrl` TEXT NULL,
  ADD COLUMN `activatedAt` DATETIME(3) NULL,
  ADD COLUMN `refundedAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `SponsorBid_stripeInvoiceId_key`
  ON `SponsorBid`(`stripeInvoiceId`);

CREATE UNIQUE INDEX `SponsorBid_stripeRefundId_key`
  ON `SponsorBid`(`stripeRefundId`);

CREATE UNIQUE INDEX `SponsorBid_stripeCreditNoteId_key`
  ON `SponsorBid`(`stripeCreditNoteId`);
