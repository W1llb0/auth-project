-- CreateTable
CREATE TABLE "LatestListing" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cmc_rank" INTEGER NOT NULL,
    "num_market_pairs" INTEGER NOT NULL,
    "circulating_supply" DOUBLE PRECISION NOT NULL,
    "total_supply" DOUBLE PRECISION NOT NULL,
    "max_supply" DOUBLE PRECISION NOT NULL,
    "infinite_supply" BOOLEAN NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "platform" JSON NOT NULL,
    "self_reported_circulating_supply" TEXT,
    "self_reported_market_cap" TEXT,
    "quote" JSON NOT NULL,

    CONSTRAINT "LatestListing_pkey" PRIMARY KEY ("id")
);
