/*
  Warnings:

  - A unique constraint covering the columns `[age_group,is_foreigner,museum_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `prices_amount_age_group_is_foreigner_museum_id_key` ON `prices`;

-- CreateIndex
CREATE UNIQUE INDEX `prices_age_group_is_foreigner_museum_id_key` ON `prices`(`age_group`, `is_foreigner`, `museum_id`);
