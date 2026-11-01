-- AlterTable
-- Idempotent: mio_panel shares this database and may add the same column.
SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Product'
    AND COLUMN_NAME = 'images'
);

SET @ddl := IF(
  @column_exists = 0,
  'ALTER TABLE `Product` ADD COLUMN `images` JSON NULL',
  'SELECT 1'
);

PREPARE product_images_stmt FROM @ddl;
EXECUTE product_images_stmt;
DEALLOCATE PREPARE product_images_stmt;
