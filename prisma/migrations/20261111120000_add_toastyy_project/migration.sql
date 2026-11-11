-- Add Toastyy to the public projects roster. Same Post shape as the
-- existing projects (name, url, image, content, type PROJECT, status).
-- Idempotent: skip when a PROJECT named Toastyy already exists.
-- Author is the earliest ADMIO user, otherwise the earliest user.
-- A database with no users inserts nothing and leaves the roster unchanged.
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
  'Toastyy',
  'https://toasty.app.miomideal.com/',
  'PROJECT',
  '/assets/apps/toastyy.jpg',
  'Pull, time it right, and level up your toast. Toast, evolved. From humble bread to a little work of art. A timing game with a 3D toaster. Pull the lever, wait until the STOP button lights up and tap in the final moment before the toast pops. Every slice earns XP, perfect timing earns more, and 1,000,000 XP unlocks the DAYDREAM toast. Difficulty knob, streaks, and best score records. A native iPhone app is in progress.',
  'PUBLIC',
  `User`.`id`,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
FROM `User`
WHERE (
  SELECT COUNT(*)
  FROM (
    SELECT 1
    FROM `Post`
    WHERE `type` = 'PROJECT' AND `name` = 'Toastyy'
  ) AS `existing_toastyy`
) = 0
ORDER BY CASE WHEN `User`.`role` = 'ADMIO' THEN 0 ELSE 1 END, `User`.`id` ASC
LIMIT 1;
