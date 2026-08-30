-- `prisma db push` created the sponsor tables but did not run the data inserts
-- from the original migrations. Add only missing production slot definitions;
-- existing slot configuration and bids remain untouched.
INSERT IGNORE INTO `SponsorSlot`
  (`id`, `placement`, `name`, `description`, `basePrice`, `minIncrement`, `enabled`, `sortOrder`, `createdAt`, `updatedAt`)
VALUES
  ('sponsor_home_hero', 'HERO_BILLBOARD', 'Above the fold', 'The loudest logo spot on the page.', 10000, 5000, true, 10, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('sponsor_home_signal', 'PROJECTS_CORNER', 'Signal boost', 'A crisp spot for a brand worth noticing.', 3000, 1500, true, 20, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('sponsor_home_indie', 'ABOUT_SIDECAR', 'About-side supporter', 'Small spot, big supporter energy.', 2000, 1000, true, 30, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('sponsor_projects_strip', 'PROJECTS_STRIP', 'Between the work', 'A wide interruption between project discoveries.', 4000, 2000, true, 25, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('sponsor_merch_banner', 'MERCH_BANNER', 'Merch intermission', 'A generous banner alongside the things we make.', 5000, 2500, true, 40, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('sponsor_footer_stamp', 'FOOTER_STAMP', 'One last thing', 'A small persistent wink before the footer.', 1500, 750, true, 50, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

UPDATE `SponsorSlot`
SET `placement` = 'HERO_BILLBOARD'
WHERE `id` = 'sponsor_home_hero' AND `placement` IS NULL;

UPDATE `SponsorSlot`
SET `placement` = 'PROJECTS_CORNER'
WHERE `id` = 'sponsor_home_signal' AND `placement` IS NULL;

UPDATE `SponsorSlot`
SET `placement` = 'ABOUT_SIDECAR'
WHERE `id` = 'sponsor_home_indie' AND `placement` IS NULL;

UPDATE `SponsorSlot`
SET `placement` = 'PROJECTS_STRIP'
WHERE `id` = 'sponsor_projects_strip' AND `placement` IS NULL;

UPDATE `SponsorSlot`
SET `placement` = 'MERCH_BANNER'
WHERE `id` = 'sponsor_merch_banner' AND `placement` IS NULL;

UPDATE `SponsorSlot`
SET `placement` = 'FOOTER_STAMP'
WHERE `id` = 'sponsor_footer_stamp' AND `placement` IS NULL;
