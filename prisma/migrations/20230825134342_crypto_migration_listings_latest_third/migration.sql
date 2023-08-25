/*
  Warnings:

  - The `self_reported_circulating_supply` column on the `LatestListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `self_reported_market_cap` column on the `LatestListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LatestListing" DROP COLUMN "self_reported_circulating_supply",
ADD COLUMN     "self_reported_circulating_supply" DOUBLE PRECISION,
DROP COLUMN "self_reported_market_cap",
ADD COLUMN     "self_reported_market_cap" DOUBLE PRECISION;
