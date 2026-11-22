-- Refresh the Tappen project for the latest update.
-- Idempotent: update every existing Tappen project, and insert one
-- only when the roster has none. Author is the earliest ADMIO user,
-- otherwise the earliest user. A database with no users inserts nothing.
UPDATE `Post`
SET
  `content` = 'Deutsch

Tappen ist ein lockeres soziales Partyspiel für Runden mit deinen Leuten. Karten drehen sich jetzt in 3D und zeigen eine echte Rückseite. Neue Karten kommen verdeckt an und der Host tippt sie auf. Die Rückseiten gibt es in farbigen Skins mit einem glänzenden Tappen Symbol. Legendäre Skins leuchten noch stärker. Der Einladungscode bleibt während der Runde sichtbar. Gäste können Karten ziehen. Raumcodes tippst du immer in Großbuchstaben, so wird das Beitreten leichter. Das Kartenset Tappen Home schaltet mit dem QR Code dauerhaft Premium und einen Premium Skin frei.

English

Tappen is a fun social party game for rounds with your people. Cards now flip in 3D with a real card back. New cards are dealt face down and the host taps to reveal them. Card backs come in full color skins with a glossy Tappen symbol. Legendary skins get a stronger shine. The room invite code stays visible during the round. Guests can drag cards. Room codes are always entered in capitals, so joining is easier. The Tappen Home card set unlocks permanent premium and a premium card skin with its QR code.',
  `url` = 'https://tappen.app',
  `updatedAt` = CURRENT_TIMESTAMP(3)
WHERE `type` = 'PROJECT'
  AND (
    LOWER(`name`) LIKE '%tappen%'
    OR `url` LIKE '%tappen.app%'
  );

INSERT INTO `Post` (
  `name`,
  `url`,
  `type`,
  `image`,
  `content`,
  `status`,
  `createdById`,
  `createdAt`,
  `updatedAt`
)
SELECT
  'Tappen App',
  'https://tappen.app',
  'PROJECT',
  '/assets/apps/tappen.png',
  'Deutsch

Tappen ist ein lockeres soziales Partyspiel für Runden mit deinen Leuten. Karten drehen sich jetzt in 3D und zeigen eine echte Rückseite. Neue Karten kommen verdeckt an und der Host tippt sie auf. Die Rückseiten gibt es in farbigen Skins mit einem glänzenden Tappen Symbol. Legendäre Skins leuchten noch stärker. Der Einladungscode bleibt während der Runde sichtbar. Gäste können Karten ziehen. Raumcodes tippst du immer in Großbuchstaben, so wird das Beitreten leichter. Das Kartenset Tappen Home schaltet mit dem QR Code dauerhaft Premium und einen Premium Skin frei.

English

Tappen is a fun social party game for rounds with your people. Cards now flip in 3D with a real card back. New cards are dealt face down and the host taps to reveal them. Card backs come in full color skins with a glossy Tappen symbol. Legendary skins get a stronger shine. The room invite code stays visible during the round. Guests can drag cards. Room codes are always entered in capitals, so joining is easier. The Tappen Home card set unlocks permanent premium and a premium card skin with its QR code.',
  'FEATURED',
  `User`.`id`,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
FROM `User`
WHERE (
  SELECT COUNT(*)
  FROM (
    SELECT 1
    FROM `Post`
    WHERE `type` = 'PROJECT'
      AND (
        LOWER(`name`) LIKE '%tappen%'
        OR `url` LIKE '%tappen.app%'
      )
  ) AS `existing_tappen`
) = 0
ORDER BY CASE WHEN `User`.`role` = 'ADMIO' THEN 0 ELSE 1 END, `User`.`id` ASC
LIMIT 1;
