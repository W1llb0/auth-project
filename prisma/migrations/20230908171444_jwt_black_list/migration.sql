/*
  Warnings:

  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Cryptocurrency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LatestListing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "password",
ADD COLUMN     "activeCampaignId" INTEGER,
ADD COLUMN     "amoCRMId" INTEGER,
ADD COLUMN     "authType" VARCHAR(255),
ADD COLUMN     "avatar" VARCHAR(255),
ADD COLUMN     "deviceLimit" INTEGER,
ADD COLUMN     "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "facebookId" VARCHAR(255),
ADD COLUMN     "firstName" VARCHAR(255),
ADD COLUMN     "getCourseId" VARCHAR(255),
ADD COLUMN     "googleId" VARCHAR(255),
ADD COLUMN     "greetingSMSSent" BOOLEAN DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN,
ADD COLUMN     "lastName" VARCHAR(255),
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "newEmail" VARCHAR(255),
ADD COLUMN     "phone" VARCHAR(255),
ADD COLUMN     "phoneVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "role" VARCHAR(255),
ADD COLUMN     "status" BOOLEAN,
ADD COLUMN     "testsEnabled" BOOLEAN,
ADD COLUMN     "tutorialDone" BOOLEAN,
ADD COLUMN     "verifiedAt" VARCHAR(255),
ADD COLUMN     "vkId" VARCHAR(255),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Cryptocurrency";

-- DropTable
DROP TABLE "LatestListing";

-- CreateTable
CREATE TABLE "ActiveCampaignCourseBindings" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "tagSubscriptionPaid" INTEGER,
    "tagPurchasePaid" INTEGER,
    "tagAllPaid" INTEGER,
    "listSubscription" INTEGER,
    "listPurchase" INTEGER,
    "listAll" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "tagSubscriptionUnpaid" INTEGER,
    "tagPurchaseUnpaid" INTEGER,
    "tagAllUnpaid" INTEGER,
    "dealGroup" INTEGER,
    "ACInitialStage" INTEGER,
    "ACSuccessStage" INTEGER,
    "ACSubscriptionTag" INTEGER,
    "ACRefundedStage" INTEGER,

    CONSTRAINT "ActiveCampaignCourseBindings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminVisits" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "path" VARCHAR(255),
    "method" VARCHAR(255),
    "description" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AdminVisits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreements" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255),
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmoCRMCourseBindings" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "pipelineId" INTEGER,
    "initialStage" INTEGER,
    "processingStage" INTEGER,
    "successStage" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "refundedStage" INTEGER,
    "vendorCodeId" INTEGER,
    "coursePage" INTEGER,

    CONSTRAINT "AmoCRMCourseBindings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnouncedSpeakers" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "avatar" VARCHAR(255),
    "title" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "priority" INTEGER,
    "avatarMobile" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "AnnouncedSpeakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoLoginCodes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AutoLoginCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "price" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "duration" INTEGER,
    "price" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "path" VARCHAR(255),

    CONSTRAINT "CourseCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "userId" INTEGER,
    "serialNumber" VARCHAR(255),
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255),

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentNotifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "commentId" INTEGER,
    "replyId" INTEGER,
    "videoId" INTEGER,
    "isReceived" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "relatedReplyId" INTEGER,
    "visible" BOOLEAN DEFAULT true,

    CONSTRAINT "CommentNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReplies" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER,
    "userId" INTEGER,
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "isEdited" BOOLEAN,
    "replyId" INTEGER,
    "visible" BOOLEAN DEFAULT true,

    CONSTRAINT "CommentReplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountdownTimerAdjustments" (
    "id" SERIAL NOT NULL,
    "timerId" INTEGER,
    "endDate" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CountdownTimerAdjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountdownTimers" (
    "id" SERIAL NOT NULL,
    "caption" VARCHAR(255),
    "type" VARCHAR(255),
    "discount" DOUBLE PRECISION,
    "expirationAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "desktopBackground" VARCHAR(255),
    "tabletBackground" VARCHAR(255),
    "mobileBackground" VARCHAR(255),
    "text" TEXT,
    "textMobile" TEXT,
    "showBanner" BOOLEAN DEFAULT false,

    CONSTRAINT "CountdownTimers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAssociatedSpeakers" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "description" TEXT,
    "image" VARCHAR(255),
    "imageMobile" VARCHAR(255),
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseAssociatedSpeakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseBundles" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "bundleId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseBundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategories" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseCategories_pkey1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseComments" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "userId" INTEGER,
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseFAQ" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "question" TEXT,
    "answer" TEXT,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseFavourites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseFavourites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLeadMagnets" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "visible" BOOLEAN DEFAULT false,
    "text" TEXT,
    "image" VARCHAR(255),
    "ACSubscriptionList" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "ACSubscriptionTag" INTEGER,
    "thanksText" TEXT,
    "title" VARCHAR(255),
    "buttonText" VARCHAR(255),
    "formText" TEXT,

    CONSTRAINT "CourseLeadMagnets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLearningBenefits" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "caption" VARCHAR(255),
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "laptopImage" TEXT,
    "phoneImage" TEXT,

    CONSTRAINT "CourseLearningBenefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseMasterInformation" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "caption" VARCHAR(255),
    "text" TEXT,
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "captionSize" INTEGER,
    "captionSizeMobile" INTEGER,

    CONSTRAINT "CourseMasterInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseMaterials" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "filename" VARCHAR(255),
    "extension" VARCHAR(255),
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "originalName" VARCHAR(255),

    CONSTRAINT "CourseMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRatings" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "userId" INTEGER,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseReleaseMailingList" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "activeCampaignId" INTEGER,

    CONSTRAINT "CourseReleaseMailingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseReviews" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "avatar" VARCHAR(255),
    "name" VARCHAR(255),
    "date" TIMESTAMPTZ(6),
    "occupation" VARCHAR(255),
    "type" VARCHAR(255),
    "order" INTEGER DEFAULT 0,
    "disabled" BOOLEAN DEFAULT false,

    CONSTRAINT "CourseReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTargetAudiences" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "title" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseTargetAudiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTopics" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "text" VARCHAR(255),
    "order" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseTopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTopicsPractical" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "text" VARCHAR(255),
    "order" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CourseTopicsPractical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTrailers" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255),
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "kinescopeUrl" VARCHAR(255),
    "useKinescope" BOOLEAN DEFAULT false,
    "visible" BOOLEAN DEFAULT true,
    "title" VARCHAR(255),
    "sectionTitle" TEXT,

    CONSTRAINT "CourseTrailers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseVideoFragments" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255),
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "kinescopeUrl" VARCHAR(255),
    "useKinescope" BOOLEAN DEFAULT false,
    "visible" BOOLEAN DEFAULT true,
    "title" VARCHAR(255),

    CONSTRAINT "CourseVideoFragments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "title" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "categoryId" INTEGER,
    "cardImage" VARCHAR(255),
    "visible" BOOLEAN DEFAULT false,
    "available" BOOLEAN DEFAULT false,
    "friendlyId" VARCHAR(255),
    "title2" VARCHAR(255),
    "dashboardImage" VARCHAR(255),
    "courseInfoImage" VARCHAR(255),
    "coursePageImage" VARCHAR(255),
    "statusText" VARCHAR(255),
    "abstract" TEXT,
    "cardImageMobile" VARCHAR(255),
    "courseInfoImageMobile" VARCHAR(255),
    "preOrderAvailable" BOOLEAN DEFAULT false,
    "preOrderDiscount" INTEGER DEFAULT 0,
    "plannedReleaseDate" TIMESTAMPTZ(6),
    "priority" INTEGER,
    "incomplete" BOOLEAN DEFAULT false,
    "plannedCompletionDate" TIMESTAMPTZ(6),
    "discount" INTEGER DEFAULT 0,
    "communityLink" VARCHAR(255),
    "ACCompletionTag" INTEGER,
    "vendorCode" INTEGER,
    "novelty" BOOLEAN DEFAULT false,
    "popular" BOOLEAN DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "bestseller" BOOLEAN,
    "ACDemoLessonTag" INTEGER,
    "hidden" BOOLEAN DEFAULT false,
    "practical" BOOLEAN DEFAULT false,
    "practicalCourseReady" BOOLEAN DEFAULT false,
    "startDate" TIMESTAMPTZ(6),
    "exactStartDate" BOOLEAN DEFAULT true,
    "releaseMailSent" BOOLEAN DEFAULT false,
    "titlePractical" VARCHAR(255),
    "completionMailSent" BOOLEAN DEFAULT false,
    "archived" BOOLEAN DEFAULT false,
    "type" VARCHAR(255),
    "noIntro" BOOLEAN DEFAULT false,
    "isFreeCourse" BOOLEAN DEFAULT false,
    "includeInPass" BOOLEAN DEFAULT true,
    "materialsInfo" TEXT,
    "durationInfo" TEXT,
    "backgroundVideo" VARCHAR(255),
    "cardImageCollection" VARCHAR(255),
    "cardImageCollectionMobile" VARCHAR(255),
    "backgroundVideoMobile" VARCHAR(255),
    "kinescopeFolder" VARCHAR(255),
    "plan1" VARCHAR(255),
    "plan2" VARCHAR(255),
    "plan3" VARCHAR(255),
    "availableOnlyInSubscription" BOOLEAN DEFAULT false,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditRequests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "relatedItemId" INTEGER,
    "type" VARCHAR(255),
    "amoCRMDealId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CreditRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomCommissions" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "commission" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CustomCommissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emails" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "email" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraSpendingFiles" (
    "id" SERIAL NOT NULL,
    "expenseId" INTEGER,
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ExtraSpendingFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraSpendings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "amount" DOUBLE PRECISION,
    "title" VARCHAR(255),
    "receiver" VARCHAR(255),

    CONSTRAINT "ExtraSpendings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "videoId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "courseId" INTEGER,

    CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FortunaAcquiredPromoCodes" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR(255),
    "code" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "FortunaAcquiredPromoCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" VARCHAR(255),
    "transactionId" VARCHAR(255),
    "code" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "giftType" VARCHAR(255),
    "promoCode" VARCHAR(255),
    "filename" VARCHAR(255),
    "relatedItemId" INTEGER,
    "tariff" VARCHAR(255),
    "usedBy" INTEGER,

    CONSTRAINT "GiftCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftPromoCodes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "tariff" VARCHAR(255),
    "expirationAt" TIMESTAMPTZ(6),
    "relatedItemId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "GiftPromoCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryEntries" (
    "id" SERIAL NOT NULL,
    "expenseId" INTEGER,
    "field" VARCHAR(255),
    "oldValue" TEXT,
    "newValue" TEXT,
    "isFile" BOOLEAN,
    "isDeleted" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "HistoryEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramPosts" (
    "id" SERIAL NOT NULL,
    "commentsCount" INTEGER,
    "likesCount" INTEGER,
    "thumbnail" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "InstagramPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KinescopeData" (
    "id" SERIAL NOT NULL,
    "videoId" VARCHAR(255),
    "userId" INTEGER,
    "watchTime" INTEGER,
    "date" TIMESTAMPTZ(6),
    "hash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "KinescopeData_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "KinescopeLessonVideos" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER,
    "kinescopeVideoId" VARCHAR(255),
    "shortId" INTEGER,
    "duration" DOUBLE PRECISION,
    "title" VARCHAR(255),
    "posterOriginal" TEXT,
    "posterMd" TEXT,
    "posterSm" TEXT,
    "posterXs" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "KinescopeLessonVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KinescopeTrailerVideos" (
    "id" SERIAL NOT NULL,
    "relatedItemId" INTEGER,
    "type" VARCHAR(255),
    "kinescopeVideoId" VARCHAR(255),
    "shortId" INTEGER,
    "duration" DOUBLE PRECISION,
    "title" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "posterOriginal" TEXT,
    "posterMd" TEXT,
    "posterSm" TEXT,
    "posterXs" TEXT,

    CONSTRAINT "KinescopeTrailerVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LastLessons" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "courseId" INTEGER,

    CONSTRAINT "LastLessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningBenefits" (
    "id" SERIAL NOT NULL,
    "caption" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "text" TEXT,
    "laptopImage" TEXT,
    "phoneImage" TEXT,

    CONSTRAINT "LearningBenefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonNotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "courseId" INTEGER,
    "videoId" INTEGER,
    "text" TEXT,
    "time" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "LessonNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailCoupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "userId" INTEGER,
    "campaign" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MailCoupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailTemplates" (
    "id" SERIAL NOT NULL,
    "templateId" VARCHAR(255),
    "name" VARCHAR(255),
    "templateEngine" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MailTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingFeedback" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255),
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MailingFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingList" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "userId" INTEGER,
    "unsubscribeCode" VARCHAR(255),
    "isReceiving" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MailingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainTrailers" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MainTrailers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaConvertJobs" (
    "id" SERIAL NOT NULL,
    "jobId" VARCHAR(255),
    "status" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MediaConvertJobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassDiscounts" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "oldPrice" DOUBLE PRECISION,
    "newPrice" DOUBLE PRECISION,
    "message" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "subscriptionId" INTEGER,

    CONSTRAINT "PassDiscounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passwords" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "paymentMethodId" VARCHAR(255),
    "cardFirst6" INTEGER,
    "cardLast4" INTEGER,
    "cardExpiryMonth" INTEGER,
    "cardExpireYear" INTEGER,
    "cardType" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "type" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneAuthMigrationCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "code" VARCHAR(255),
    "email" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PhoneAuthMigrationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneConfirmationCodes" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR(255),
    "code" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PhoneConfirmationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phones" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "phone" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialDeals" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "callerCourseId" INTEGER,
    "amoCRMDealId" INTEGER,
    "type" VARCHAR(255),
    "purchaseInitiated" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "variant" VARCHAR(255),

    CONSTRAINT "PotentialDeals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticalLessons" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "passingGrade" DOUBLE PRECISION DEFAULT 0,
    "title" VARCHAR(255),
    "description" TEXT,
    "duration" INTEGER,
    "resourceId" VARCHAR(255) NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255),
    "disabled" BOOLEAN DEFAULT false,
    "certificateCheckpoint" BOOLEAN DEFAULT false,

    CONSTRAINT "PracticalLessons_pkey" PRIMARY KEY ("resourceId")
);

-- CreateTable
CREATE TABLE "PracticeRequests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "relatedItemId" INTEGER,
    "amoCRMDealId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "PracticeRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSessions" (
    "id" SERIAL NOT NULL,
    "grade" DOUBLE PRECISION DEFAULT 0,
    "passed" BOOLEAN DEFAULT false,
    "lessonId" VARCHAR(255),
    "sessionId" VARCHAR(255),
    "nonce" VARCHAR(255),
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "resultId" VARCHAR(255),
    "onReview" BOOLEAN DEFAULT false,

    CONSTRAINT "PracticeSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCodes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "discount" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "amount" INTEGER,
    "type" VARCHAR(255),
    "expirationAt" TIMESTAMPTZ(6),
    "relatedItemId" INTEGER,
    "units" VARCHAR(255) DEFAULT 'percent',
    "compatibleWithDiscounts" BOOLEAN DEFAULT true,
    "maxDiscount" BOOLEAN DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "PromoCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "key" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelevantCourses" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "relevantId" INTEGER,
    "type" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RelevantCourses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "code" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ResetPasswordCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiggedCourseRatings" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RiggedCourseRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "SignUpEmailCodes" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "code" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SignUpEmailCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAnnouncements" (
    "id" SERIAL NOT NULL,
    "text" TEXT DEFAULT '',
    "type" VARCHAR(255),
    "image" VARCHAR(255),
    "name" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "url" VARCHAR(255),
    "avatar" VARCHAR(255),

    CONSTRAINT "SocialAnnouncements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255),
    "link" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerAwards" (
    "id" SERIAL NOT NULL,
    "image" VARCHAR(255),
    "title" VARCHAR(255),
    "order" INTEGER,
    "courseId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerAwards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerContracts" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerContracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerLeads" (
    "id" SERIAL NOT NULL,
    "relatedItemId" INTEGER,
    "leadId" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "amount" DOUBLE PRECISION,
    "status" INTEGER,
    "pipeline" INTEGER,
    "leadCreatedAt" TIMESTAMPTZ(6),
    "leadClosedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerLeads_pkey" PRIMARY KEY ("leadId")
);

-- CreateTable
CREATE TABLE "SpeakerNotifications" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "userId" INTEGER,
    "text" TEXT,
    "type" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerProjects" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "image" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerProjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerSignatures" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER,
    "filename" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpeakerSignatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speakers" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255),
    "middleName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "alias" VARCHAR(255),
    "description" TEXT,
    "avatar" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "occupation" VARCHAR(255),
    "gender" VARCHAR(255),
    "userId" INTEGER,
    "customNameGenitive" VARCHAR(255),

    CONSTRAINT "Speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionCharges" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "subscriptionId" VARCHAR(255),
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SubscriptionCharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionDetails" (
    "id" SERIAL NOT NULL,
    "price" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "durationUnits" VARCHAR(255),
    "type" VARCHAR(255),

    CONSTRAINT "Subscribes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionDiscounts" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION,
    "oldPrice" DOUBLE PRECISION,
    "newPrice" DOUBLE PRECISION,
    "message" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "priceId" INTEGER,

    CONSTRAINT "Discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPriceAdjustments" (
    "id" SERIAL NOT NULL,
    "priceId" INTEGER,
    "newPrice" INTEGER,
    "percentage" INTEGER,
    "startDate" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "installmentsCount" INTEGER,
    "installmentPrice" DOUBLE PRECISION,

    CONSTRAINT "SubscriptionPriceAdjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPrices" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255),
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "duration" INTEGER,
    "durationUnits" VARCHAR(255),
    "relatedItemId" INTEGER,
    "disabled" BOOLEAN DEFAULT false,
    "unlimited" BOOLEAN DEFAULT false,
    "variant" VARCHAR(255),
    "installmentPrice" DOUBLE PRECISION,
    "startDate" TIMESTAMPTZ(6),
    "exactStartDate" BOOLEAN DEFAULT false,
    "extended" BOOLEAN DEFAULT false,
    "extensionAmount" INTEGER DEFAULT 0,
    "installmentsCount" INTEGER,

    CONSTRAINT "CoursePrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPromoCodes" (
    "id" SERIAL NOT NULL,
    "relatedItemId" INTEGER,
    "userId" INTEGER,
    "promoCode" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "expirationAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255),
    "reusable" BOOLEAN DEFAULT false,

    CONSTRAINT "SubscriptionPromoCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "transactionId" VARCHAR(255),
    "type" VARCHAR(255),
    "relatedItemId" INTEGER,
    "limited" BOOLEAN DEFAULT false,
    "expirationAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "isPreOrder" BOOLEAN DEFAULT false,
    "status" VARCHAR(255) DEFAULT 'active',
    "cancelledAt" TIMESTAMPTZ(6),
    "refundStatus" TIMESTAMPTZ(6),
    "variant" VARCHAR(255),
    "recurringSubscriptionId" VARCHAR(255),
    "extended" BOOLEAN DEFAULT false,
    "extensionPeriodExpired" BOOLEAN DEFAULT false,
    "plan" VARCHAR(255),

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtractions" (
    "id" SERIAL NOT NULL,
    "tax" DOUBLE PRECISION,
    "commission" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Subtractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAnswers" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "isCorrect" BOOLEAN DEFAULT false,
    "questionId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "image" VARCHAR(255),
    "order" INTEGER,

    CONSTRAINT "TestAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestions" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "text" TEXT,
    "multipleChoice" BOOLEAN DEFAULT false,
    "testId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255),
    "commentary" TEXT,
    "freeAnswer" BOOLEAN,

    CONSTRAINT "TestQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResults" (
    "id" SERIAL NOT NULL,
    "grade" INTEGER DEFAULT 0,
    "passed" BOOLEAN DEFAULT false,
    "testId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TestResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestVideos" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255),
    "questionId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "originalName" VARCHAR(255),

    CONSTRAINT "TestVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tests" (
    "id" SERIAL NOT NULL,
    "passingGrade" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "showAnswers" BOOLEAN DEFAULT true,
    "showResults" BOOLEAN DEFAULT true,
    "showRepeatButton" BOOLEAN DEFAULT true,
    "showShareButtons" BOOLEAN DEFAULT true,
    "visible" BOOLEAN DEFAULT true,
    "courseId" INTEGER,

    CONSTRAINT "Tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionUTMData" (
    "id" SERIAL NOT NULL,
    "transactionId" VARCHAR(255),
    "type" VARCHAR(255),
    "value" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TransactionUTMData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "transactionId" VARCHAR(255),
    "status" VARCHAR(255),
    "amount" INTEGER,
    "type" VARCHAR(255),
    "relatedItemId" INTEGER,
    "capturedAt" TIMESTAMPTZ(6),
    "expirationAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "promoCode" VARCHAR(255),
    "isGift" BOOLEAN,
    "duration" INTEGER,
    "durationUnits" VARCHAR(255),
    "orderNumber" VARCHAR(255),
    "paidOrNotified" BOOLEAN DEFAULT false,
    "unlimited" BOOLEAN DEFAULT false,
    "activeCampaignSuccessTag" INTEGER,
    "errored" BOOLEAN,
    "description" VARCHAR(255),
    "activeCampaignDealId" INTEGER,
    "amoCRMDealId" INTEGER,
    "amoCRMSuccessStage" INTEGER,
    "ACSuccessStage" INTEGER,
    "isPreOrder" BOOLEAN DEFAULT false,
    "callerCourseId" INTEGER,
    "GTMEventPushed" BOOLEAN DEFAULT false,
    "googleAnalyticsUserId" VARCHAR(255),
    "paymentUrl" VARCHAR(255),
    "lastAbandonedCartReminder" TIMESTAMPTZ(6),
    "abandonedCartNotificationsSent" INTEGER DEFAULT 0,
    "shortUrlError" VARCHAR(255),
    "shortUrlAbandonedCart1" VARCHAR(255),
    "shortUrlAbandonedCart2" VARCHAR(255),
    "shortUrlRenewal" VARCHAR(255),
    "paymentType" VARCHAR(255),
    "acquirer" VARCHAR(255),
    "formUrl" TEXT,
    "paymentExpirationDate" TIMESTAMPTZ(6),
    "variant" VARCHAR(255),
    "processed" BOOLEAN DEFAULT false,
    "bundledItems" INTEGER[],
    "recurringPaymentPeriod" VARCHAR(255),
    "recurringPaymentNextDate" TIMESTAMPTZ(6),
    "recurringSubscriptionId" VARCHAR(255),
    "fbPixelCookie" VARCHAR(255),
    "fbClIdCookie" VARCHAR(255),
    "fbPurchaseEventId" VARCHAR(255),
    "clientIPAddress" VARCHAR(255),
    "clientUserAgent" TEXT,
    "invalidPhone" BOOLEAN DEFAULT false,
    "extended" BOOLEAN DEFAULT false,
    "extensionAmount" INTEGER DEFAULT 0,
    "shortUrlAbandonedCart3" VARCHAR(255),
    "shortUrlAbandonedCart4" VARCHAR(255),
    "shortUrlAbandonedCart5" VARCHAR(255),
    "upgrade" BOOLEAN DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpgradeRequests" (
    "id" SERIAL NOT NULL,
    "transactionId" VARCHAR(255),
    "amoCRMDealId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UpgradeRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsedPromoCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "code" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UsedPromoCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDevices" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "deviceId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserDevices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "courseId" INTEGER,
    "text" TEXT,
    "socialLink" TEXT,
    "reviewLink" TEXT,
    "photo" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSignUpParams" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "UTMSource" VARCHAR(255),
    "googleClientId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserSignUpParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUnlockedLessons" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "lessonId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserUnlockedLessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifyEmailCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "code" VARCHAR(255),
    "isUsed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VerifyEmailCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoComments" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER,
    "userId" INTEGER,
    "text" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "isEdited" BOOLEAN,
    "visible" BOOLEAN DEFAULT true,

    CONSTRAINT "VideoComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoEncryptCodes" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255),
    "code" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VideoEncryptCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoList" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "videoId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VideoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "videoId" INTEGER,
    "time" DOUBLE PRECISION,
    "isCompleted" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoRatings" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER,
    "userId" INTEGER,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VideoRatings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "title" VARCHAR(255),
    "filename" VARCHAR(255),
    "views" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "order" INTEGER,
    "thumbnail" VARCHAR(255),
    "duration" INTEGER,
    "isEncrypted" BOOLEAN,
    "disabled" BOOLEAN DEFAULT false,
    "originalName" VARCHAR(255),
    "filenameUpdatedAt" TIMESTAMPTZ(6),
    "type" VARCHAR(255) DEFAULT 'lesson',
    "demoPlaybackDisabled" BOOLEAN DEFAULT false,
    "kinescopeUrl" VARCHAR(255),
    "useKinescope" BOOLEAN DEFAULT false,
    "ACCompletionTag" INTEGER,
    "freeLesson" BOOLEAN DEFAULT false,
    "moduleTitle" VARCHAR(255),
    "speakerId" INTEGER,
    "externalLink" VARCHAR(255),

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visits" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "browser" VARCHAR(255),
    "os" VARCHAR(255),
    "lastActivity" TIMESTAMPTZ(6),

    CONSTRAINT "Visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JwtBlackList" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JwtBlackList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JwtBlackList_tokenId_key" ON "JwtBlackList"("tokenId");

-- AddForeignKey
ALTER TABLE "ActiveCampaignCourseBindings" ADD CONSTRAINT "ActiveCampaignCourseBindings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AdminVisits" ADD CONSTRAINT "AdminVisits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AmoCRMCourseBindings" ADD CONSTRAINT "AmoCRMCourseBindings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AutoLoginCodes" ADD CONSTRAINT "AutoLoginCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentNotifications" ADD CONSTRAINT "CommentNotifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "VideoComments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentNotifications" ADD CONSTRAINT "CommentNotifications_relatedReplyId_fkey" FOREIGN KEY ("relatedReplyId") REFERENCES "CommentReplies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentNotifications" ADD CONSTRAINT "CommentNotifications_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "CommentReplies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentNotifications" ADD CONSTRAINT "CommentNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentNotifications" ADD CONSTRAINT "CommentNotifications_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentReplies" ADD CONSTRAINT "CommentReplies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "VideoComments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentReplies" ADD CONSTRAINT "CommentReplies_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "CommentReplies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CountdownTimerAdjustments" ADD CONSTRAINT "CountdownTimerAdjustments_timerId_fkey" FOREIGN KEY ("timerId") REFERENCES "CountdownTimers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseAssociatedSpeakers" ADD CONSTRAINT "CourseAssociatedSpeakers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseBundles" ADD CONSTRAINT "CourseBundles_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseBundles" ADD CONSTRAINT "CourseBundles_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseCategories" ADD CONSTRAINT "CourseCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseCategories" ADD CONSTRAINT "CourseCategories_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseComments" ADD CONSTRAINT "CourseComments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseComments" ADD CONSTRAINT "CourseComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseFAQ" ADD CONSTRAINT "CourseFAQ_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseFavourites" ADD CONSTRAINT "CourseFavourites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseFavourites" ADD CONSTRAINT "CourseFavourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseLeadMagnets" ADD CONSTRAINT "CourseLeadMagnets_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseLearningBenefits" ADD CONSTRAINT "CourseLearningBenefits_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseMasterInformation" ADD CONSTRAINT "CourseMasterInformation_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseMaterials" ADD CONSTRAINT "CourseMaterials_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseRatings" ADD CONSTRAINT "CourseRatings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseRatings" ADD CONSTRAINT "CourseRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseReleaseMailingList" ADD CONSTRAINT "CourseReleaseMailingList_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseReviews" ADD CONSTRAINT "CourseReviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseTargetAudiences" ADD CONSTRAINT "CourseTargetAudiences_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseTopics" ADD CONSTRAINT "CourseTopics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseTopicsPractical" ADD CONSTRAINT "CourseTopicsPractical_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseTrailers" ADD CONSTRAINT "CourseTrailers_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseVideoFragments" ADD CONSTRAINT "CourseVideoFragments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CreditRequests" ADD CONSTRAINT "CreditRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CustomCommissions" ADD CONSTRAINT "CustomCommissions_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ExtraSpendingFiles" ADD CONSTRAINT "ExtraSpendingFiles_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "ExtraSpendings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ExtraSpendings" ADD CONSTRAINT "ExtraSpendings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Bookmarks_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GiftCodes" ADD CONSTRAINT "GiftCodes_usedBy_fkey" FOREIGN KEY ("usedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GiftCodes" ADD CONSTRAINT "GiftCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "HistoryEntries" ADD CONSTRAINT "HistoryEntries_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "ExtraSpendings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "KinescopeLessonVideos" ADD CONSTRAINT "KinescopeLessonVideos_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LastLessons" ADD CONSTRAINT "LastLessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LastLessons" ADD CONSTRAINT "LastLessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LastLessons" ADD CONSTRAINT "LastLessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LessonNotes" ADD CONSTRAINT "LessonNotes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LessonNotes" ADD CONSTRAINT "LessonNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LessonNotes" ADD CONSTRAINT "LessonNotes_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MailingList" ADD CONSTRAINT "MailingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PassDiscounts" ADD CONSTRAINT "PassDiscounts_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "SubscriptionDetails"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Passwords" ADD CONSTRAINT "Passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PaymentMethods" ADD CONSTRAINT "PaymentMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PhoneAuthMigrationCodes" ADD CONSTRAINT "PhoneAuthMigrationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Phones" ADD CONSTRAINT "Phones_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PotentialDeals" ADD CONSTRAINT "PotentialDeals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PracticalLessons" ADD CONSTRAINT "PracticalLessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PracticeRequests" ADD CONSTRAINT "PracticeRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PracticeSessions" ADD CONSTRAINT "PracticeSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RelevantCourses" ADD CONSTRAINT "RelevantCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ResetPasswordCodes" ADD CONSTRAINT "ResetPasswordCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RiggedCourseRatings" ADD CONSTRAINT "RiggedCourseRatings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerAwards" ADD CONSTRAINT "SpeakerAwards_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerContracts" ADD CONSTRAINT "SpeakerContracts_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerNotifications" ADD CONSTRAINT "SpeakerNotifications_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerNotifications" ADD CONSTRAINT "SpeakerNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerProjects" ADD CONSTRAINT "SpeakerProjects_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeakerSignatures" ADD CONSTRAINT "SpeakerSignatures_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speakers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Speakers" ADD CONSTRAINT "Speakers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubscriptionCharges" ADD CONSTRAINT "SubscriptionCharges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubscriptionDiscounts" ADD CONSTRAINT "SubscriptionDiscounts_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "SubscriptionPrices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubscriptionPriceAdjustments" ADD CONSTRAINT "SubscriptionPriceAdjustments_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "SubscriptionPrices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubscriptionPromoCodes" ADD CONSTRAINT "SubscriptionPromoCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestAnswers" ADD CONSTRAINT "TestAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestQuestions" ADD CONSTRAINT "TestQuestions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestResults" ADD CONSTRAINT "TestResults_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestResults" ADD CONSTRAINT "TestResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestVideos" ADD CONSTRAINT "TestVideos_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Tests" ADD CONSTRAINT "Tests_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsedPromoCodes" ADD CONSTRAINT "UsedPromoCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserDevices" ADD CONSTRAINT "UserDevices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserReviews" ADD CONSTRAINT "UserReviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserReviews" ADD CONSTRAINT "UserReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserSignUpParams" ADD CONSTRAINT "UserSignUpParams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserUnlockedLessons" ADD CONSTRAINT "UserUnlockedLessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserUnlockedLessons" ADD CONSTRAINT "UserUnlockedLessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VerifyEmailCodes" ADD CONSTRAINT "VerifyEmailCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoComments" ADD CONSTRAINT "VideoComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoComments" ADD CONSTRAINT "VideoComments_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoList" ADD CONSTRAINT "VideoList_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoProgress" ADD CONSTRAINT "VideoProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoProgress" ADD CONSTRAINT "VideoProgress_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoRatings" ADD CONSTRAINT "VideoRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VideoRatings" ADD CONSTRAINT "VideoRatings_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
