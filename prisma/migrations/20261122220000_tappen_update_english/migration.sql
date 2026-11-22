-- Replace the bilingual Tappen project description with English only.
-- The earlier migration already wrote the German and English text.
-- This update leaves that migration in place and rewrites the stored copy.
UPDATE `Post`
SET
  `content` = 'Tappen is a fun social party game. Cards now flip in 3D with glossy skins, and a Home Edition QR code unlocks permanent premium.',
  `updatedAt` = CURRENT_TIMESTAMP(3)
WHERE `type` = 'PROJECT'
  AND (
    LOWER(TRIM(`name`)) IN ('tappen', 'tappen app')
    OR `url` LIKE '%://tappen.app%'
    OR `url` LIKE '%://%.tappen.app%'
  );
