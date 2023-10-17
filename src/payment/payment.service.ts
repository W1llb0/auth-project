import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Body, Headers, Request, Response } from '@nestjs/common';
import {Config} from '../config/index';
import moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaClient, private config: Config) {}

  ALLOWED_PAYMENT_METHODS = [
    'cloudpayments',
    'sberbank',
    'paymentnut',
    'appex',
  ];
  ALLOWED_PURCHASE_TYPES = ['course', 'pass', 'custom'];

  SUBSCRIPTION_TYPES = {
    pass: 'pass',
    course: 'course',
    limited: 'limited',
    category: 'category',
    bundle: 'bundle',
    custom: 'custom',
    marathon: 'marathon',
    meet: 'meet',
  };

  compareBundledItems = (previousItems, currentItems) => {
    const currentArrayIsEmpty = !(currentItems && currentItems.length);
    const previousArrayIsEmpty = !(previousItems && previousItems.length);
    if (previousArrayIsEmpty && currentArrayIsEmpty) {
      return true;
    }
    if (previousArrayIsEmpty && !currentArrayIsEmpty) {
      return false;
    }
    if (!previousArrayIsEmpty && currentArrayIsEmpty) {
      return false;
    }

    return (
      currentItems.length === previousItems.length &&
      currentItems.every((element) => previousItems.includes(element))
    );
  };

  async buy(
    @Body() body: any,
    @Request() req: Request,
    @Response() res: Response,
    @Headers() headers: any,
  ) {
    try {
      const {
        relatedItemId,
        callerCourseId,
        type,
        variant = null,
        UTMData = {},
        promoCode = null,
        paymentMethod,
        isPreOrder = false,
        isGift = false,
        giftType,
        email: recipientEmail = '',
        displayedPrice,
        bundledItems = [],
        upgrade = false,
        upgradeInfo = {},
        recurringPaymentPeriod,
        fbPurchaseEventId,
        amoDealName,
        additionalParams: { adName = '' } = {},
        page,
        url,
        button,
      } = body;

      const {
        user: { userId },
        cookies: {
          _ga: googleAnalyticsUserId,
          _fbp: fbPixelCookie,
          _fbc: fbClIdCookie,
          deduplication_cookie: UTMSourceCookie,
        },
        headers: { 'x-forwarded-for': IPAddress },
      } = req;

      const userAgent = req.headers['User-Agent'];

      const potentialDealCondition =
        type === this.SUBSCRIPTION_TYPES.course
          ? {
              type,
              variant,
              callerCourseId,
            }
          : {
              OR: [{ type }, { type: null }],
            };

      const [
        {
          firstName,
          lastName,
          fullName,
          email,
          phone,
          activeCampaignId,
          amoCRMId,
        },
        subscriptionPriceData,
        oldSubscription,
        potentialDeal,
        unfinishedTransaction,
        callerCourse,
      ] = await Promise.all([
        this.prisma.users.findUnique({
          where: { id: userId },
        }),
        this.prisma.subscriptionPrices.findFirst({
          where: {
            type,
            relatedItemId,
            variant: variant || null,
          },
          include: {
            SubscriptionDiscounts: true,
            SubscriptionPriceAdjustments: {
              orderBy: {
                startDate: 'asc',
              },
            },
          },
        }),
        
        this.prisma.subscriptions.findFirst({
          where: {
            userId,
            type,
            relatedItemId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.potentialDeals.findFirst({
          where: {
            userId,
            purchaseInitiated: false,
            ...potentialDealCondition,
          },
        }),
        this.prisma.transactions.findFirst({
          where: {
            userId,
            type,
            isGift,
            variant: variant || null,
            isPreOrder,
            relatedItemId,
            status: this.config.TRANSACTION_STATUSES.pending,
            acquirer: paymentMethod,
            createdAt: {
              gte: moment()
                .subtract(this.config.PAYMENT_EXPIRATION_DAYS, 'days')
                .toDate(),
            },
          },
        }),
        this.prisma.courses.findFirst({
          where: {
            id:
              type === this.config.SUBSCRIPTION_TYPES.course
                ? relatedItemId
                : callerCourseId || null,
          },
          include: {
            ActiveCampaignCourseBindings: true,
            AmoCRMCourseBindings: true,
            Speakers: {
              select: {
                id: true,
                lastName: true,
                firstName: true
              }
            },
          },
        }),        
      ]);
      if (!firstName || !lastName || !email || !this.ALLOWED_PURCHASE_TYPES.includes(type)) {
        throw new Error(this.config.SERVER_MESSAGES.missingDataOrInvalid);
      }
  
      const promoData = await getPromoCodeInfo({
        promoCode,
        userId,
        type,
        relatedItemId,
      });
  
      const {
        duration,
        durationUnits,
        extended,
        extensionAmount,
      } = subscriptionPriceData;
  
      // todo remove hardcode
      const calculatedPrice = upgrade
        ? await calculateUpgradePrice({
          subscriptionPriceData,
          transactionId: upgradeInfo.transactionId,
          userId,
        })
        : helpers.calculateFinalPrice({
          subscriptionPriceData,
          promoData,
        });
  
      const priceInMinUnits = calculatedPrice * 100;
  
      if (unfinishedTransaction
        && paymentMethod === PAYMENT_ACQUIRERS.cloudpayments
        && compareBundledItems(
          unfinishedTransaction.bundledItems,
          bundledItems,
        )) {
        const {
          transactionId,
          formUrl,
          description,
          orderNumber,
          promoCode: oldPromoCode,
          amount: oldAmount,
          amoCRMDealId,
          activeCampaignDealId,
        } = unfinishedTransaction;
  
        await updateUTMData(unfinishedTransaction, UTMData, { UTMSourceCookie, adName });
  
        if (oldPromoCode !== promoCode || oldAmount !== displayedPrice) {
          if (amoCRMDealId) {
            updateAmoCRMDeal(amoCRMDealId, {
              amount: calculatedPrice,
              promoCode,
            }).catch(() => {
              console.log(`Failed to update amoCRM deal with transactionId ${transactionId}`);
            });
          }
  
          if (activeCampaignDealId) {
            activeCampaignApi.updateDeal(activeCampaignDealId, {
              value: priceInMinUnits,
            }).catch(() => {
              console.log(`Failed to update ActiveCampaign deal with transactionId ${transactionId}`);
            });
          }
  
          await unfinishedTransaction.update({
            promoCode,
            amount: calculatedPrice,
          });
        }
  
        await unfinishedTransaction.update({
          fbPurchaseEventId,
          fbClIdCookie,
          fbPixelCookie,
          clientIPAddress: IPAddress,
          clientUserAgent: userAgent,
        });
  
        return helpers.sendResponse({
          req,
          res,
          data: {
            responseConfirmationUrl: formUrl,
            paymentData: {
              description,
              price: calculatedPrice,
              userId,
              orderNumber,
              orderId: transactionId,
              title: callerCourse ? callerCourse.title : null,
              courseId: callerCourse ? callerCourse.friendlyId : null,
            },
          },
        });
      }
  
      const oldExpirationAt = oldSubscription ? oldSubscription.expirationAt : null;
      if (!helpers.checkAvailablePurchase(oldExpirationAt)) {
        throw new Error(SERVER_MESSAGES.alreadyHave);
      }
  
      const transaction = await Transactions.create();
  
      const orderNumber = await helpers.generateOrderNumber(userId, transaction.id);
  
      const {
        title: paymentTitle,
        description,
        shortDescription,
      } = await generatePaymentInfo({
        type,
        callerCourse,
        promoData,
        isGift,
        isPreOrder,
        giftType,
        recipientEmail,
        bundledItems,
        recurringPaymentPeriod,
      });
  
      const paymentExpirationDate = moment().add(PAYMENT_EXPIRATION_DAYS, 'days').format();
  
      const paymentObjects = {
        [PAYMENT_ACQUIRERS.paypal]: {
          intent: 'sale',
          payer: {
            payment_method: 'paypal',
          },
          redirect_urls: {
            return_url: `${PATH_TO_SERVER}/api/payment/paypal/execute`,
            cancel_url: `${PATH_TO_CLIENT}`,
          },
          transactions: [{
            item_list: {
              items: [{
                name: paymentTitle,
                price: calculatedPrice,
                currency: 'RUB',
                quantity: 1,
              }],
            },
            amount: {
              currency: 'RUB',
              total: calculatedPrice,
            },
            description,
          }],
        },
        [PAYMENT_ACQUIRERS.sberbank]: {
          userName: SBERBANK_AUTH_USERNAME,
          password: SBERBANK_AUTH_PASSWORD,
          description,
          amount: priceInMinUnits,
          currency: CURRENCY_CODE_RUB,
          clientId: userId,
          orderNumber,
          expirationDate: paymentExpirationDate,
          returnUrl: `${PATH_TO_SERVER}/api/payment/return`,
          failUrl: `${PATH_TO_SERVER}/api/payment/fail`,
        },
        [PAYMENT_ACQUIRERS.paymentnut]: {
          amount: calculatedPrice,
          description,
        },
        [PAYMENT_ACQUIRERS.appex]: {
          amount: calculatedPrice,
          description,
          email,
          phone,
        },
      };
  
      const paymentObject = paymentObjects[paymentMethod];
  
      const {
        formUrl,
        orderId,
      } = await createPayment(paymentMethod, paymentObject, transaction);
  
      const capturedAt = new Date();
  
      const {
        ACInitialStage,
        ACSuccessStage,
        activeCampaignSuccessTag,
        amoCRMSuccessStage,
        // amoCRMProcessingStage,
        // amoCRMPipelineId,
      } = getCRMDealStages({
        type,
        variant,
        callerCourse,
        page,
      });
  
      const paymentUrl = helpers.makeAbandonedPaymentUrl(orderId);
  
      await transaction.update({
        userId,
        amount: recurringPaymentPeriod ? displayedPrice : calculatedPrice,
        status: TRANSACTION_STATUSES.pending,
        transactionId: orderId,
        type,
        relatedItemId,
        capturedAt,
        paymentExpirationDate,
        promoCode: promoData ? promoData.code : null,
        duration,
        durationUnits,
        orderNumber,
        description,
        ACSuccessStage,
        callerCourseId,
        amoCRMSuccessStage,
        activeCampaignSuccessTag,
        acquirer: paymentMethod,
        googleAnalyticsUserId,
        isPreOrder,
        isGift,
        paymentUrl,
        formUrl,
        variant,
        bundledItems: bundledItems && bundledItems.length ? bundledItems : null,
        recurringPaymentPeriod,
        fbPixelCookie,
        fbClIdCookie,
        fbPurchaseEventId,
        clientIPAddress: IPAddress,
        clientUserAgent: userAgent,
        extended,
        extensionAmount,
        upgrade,
      });
  
      if (isGift) {
        const giftCode = giftType === GIFT_TYPES.email ? uuid() : '';
  
        let giftPromoCode = '';
  
        if (giftType === GIFT_TYPES.print) {
          if (type === SUBSCRIPTION_TYPES.course) {
            const { speaker } = callerCourse;
            giftPromoCode = `${speaker.lastName}-${transaction.id}-${uuid().substring(0, 6)}-100%`;
          }
          if (type === SUBSCRIPTION_TYPES.pass) {
            giftPromoCode = `YEAR_FREE-${transaction.id}-${uuid().substring(0, 6)}-100%`;
          }
        }
  
        await GiftCodes.create({
          userId,
          transactionId: orderId,
          email: recipientEmail,
          giftType,
          code: giftCode,
          promoCode: giftPromoCode,
          tariff: type,
          relatedItemId,
        });
      }
  
      await helpers.createUTMEntries(orderId, UTMData);
  
      const activeCampaignContactId = activeCampaignId
        || await activeCampaignApi.createOrUpdateContact({
          firstName,
          lastName,
          phone,
          email,
        });
  
      const amoCRMContactId = amoCRMId || await createAmoCRMUser({
        fullName,
        email,
        phone,
      });
      if (!amoCRMContactId || !amoCRMId) {
        await Users.update({
          amoCRMId: amoCRMContactId,
          activeCampaignId: activeCampaignContactId,
        }, {
          where: { id: userId },
        });
      }
  
      const {
        pipeline,
        stage,
        name,
        vendorCodes,
        courseType,
        tags,
        amount,
      } = await getAmoDealParams({
        callerCourseId,
        type,
        page,
        button,
        variant,
        isGift,
        bundledItems,
        upgrade,
        upgradeInfo,
        amount: calculatedPrice,
        customName: amoDealName,
      });
  
      const amoDealUpdateParams = potentialDeal ? {
        replaceExistingLead: true,
        id: potentialDeal.amoCRMDealId,
      } : {};
  
      createAmoCRMDeal({
        name,
        contact: amoCRMContactId,
        pipeline,
        stage,
        vendorCodes,
        courseType,
        tags,
        amount,
        paymentType: paymentMethod,
        transactionId: orderId,
        addedToCart: true,
        UTMSourceCookie,
        orderNumber,
        promoCode,
        UTMData,
        adName,
        url,
        clientId: googleAnalyticsUserId,
      }, amoDealUpdateParams).then((amoCRMDealId) => {
        if (potentialDeal) {
          potentialDeal.update({
            purchaseInitiated: true,
          });
        }
        transaction.update({
          amoCRMDealId,
        });
        addLeadEntry({
          dealName: name,
          name: fullName,
          phone,
          email,
          type,
          callerCourseId,
          bundledItems,
          url,
          amoCRMDealId,
          userId,
          amount,
        });
      }).catch((e) => {
        console.log(`Failed to create amoCRM deal with transactionId ${orderId}`);
      });
  
      const ACDealName = getActiveCampaignDealName({
        type,
        callerCourse,
        isGift,
      });
  
      activeCampaignApi.createDeal({
        contact: activeCampaignContactId,
        title: ACDealName,
        value: priceInMinUnits,
        stage: ACInitialStage,
        firstName,
        lastName,
        phone,
        email,
        date: transaction.createdAt,
        amount: priceInMinUnits,
        paymentUrl,
        description: shortDescription,
        orderNumber,
        isPreOrder,
        courseTitle: (type === SUBSCRIPTION_TYPES.course && callerCourse) ? callerCourse.title : null,
        type: AC_SUBSCRIPTION_TYPES[type],
        transactionId: orderId,
        UTMData,
        promoCode,
        url,
        courseId: (type === SUBSCRIPTION_TYPES.course && callerCourse) ? callerCourse.id : null,
      }).then((activeCampaignDealId) => {
        transaction.update({
          activeCampaignDealId,
        });
      }).catch((e) => {
        console.log(`Failed to create ActiveCampaign deal with transactionId ${orderId}`, e);
      });
  
      return helpers.sendResponse({
        req,
        res,
        data: {
          responseConfirmationUrl: formUrl,
          paymentData: {
            description,
            price: calculatedPrice,
            userId,
            orderNumber,
            orderId,
            courseId: callerCourse ? callerCourse.friendlyId : null,
            title: callerCourse ? callerCourse.title : null,
            vendorCode: callerCourse ? callerCourse.vendorCode : null,
            promoCode,
            isPreOrder,
            type,
            extended,
            extensionAmount,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return helpers.sendError({ req, res, error });
    }
}
