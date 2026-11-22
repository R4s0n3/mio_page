-- Replace the bilingual Tappen project description with English only.
-- The earlier migration already wrote the German and English text.
-- This update leaves that migration in place and rewrites the stored copy.
UPDATE `Post`
SET
  `content` = 'Tappen is a fun social party game for rounds with your people. Cards now flip in 3D with a real card back. New cards are dealt face down and the host taps to reveal them. Card backs come in full color skins with a glossy Tappen symbol. Legendary skins get a stronger shine. The room invite code stays visible during the round. Guests can drag cards. Room codes are always entered in capitals, so joining is easier. The Tappen Home card set unlocks permanent premium and a premium card skin with its QR code.',
  `updatedAt` = CURRENT_TIMESTAMP(3)
WHERE `type` = 'PROJECT'
  AND (
    LOWER(TRIM(`name`)) IN ('tappen', 'tappen app')
    OR `url` LIKE '%://tappen.app%'
    OR `url` LIKE '%://%.tappen.app%'
  );
