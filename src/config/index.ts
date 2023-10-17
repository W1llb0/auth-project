export class Config {
  SERVER_MESSAGES = {
    fileNotFound: 'FILE_NOT_FOUND',
    userNotFound: 'USER_NOT_FOUND',
    missingDataOrInvalid: 'MISSING_DATA_OR_DATA_IS_NOT_VALID',
    ok: 'OK',
    noAdditionalInformation: 'NO_ADDITIONAL_INFORMATION',
    internalServerError: 'INTERNAL_SERVER_ERROR',
    accessDenied: 'ACCESS_DENIED',
    missingToken: 'MISSING_TOKEN',
    expiredToken: 'TOKEN_EXPIRED',
    expiredRefreshToken: 'REFRESH_TOKEN_EXPIRED',
    emailInUse: 'EMAIL_ALREADY_IN_USE',
    methodNotAllowed: 'METHOD_NOT_ALLOWED',
    paymentError: 'PAYMENT_ERROR',
    refundError: 'REFUND_ERROR',
    alreadyHave: 'ALREADY_HAVE',
    cardAlreadyAdded: 'CARD_HAS_BEEN_ALREADY_ADDED',
    notFound: 'NOT_FOUND',
    emailIsRequired: 'EMAIL_IS_REQUIRED',
    notVerified: 'EMAIL_NOT_VERIFIED',
    deviceNumberLimitReached: 'DEVICE_NUMBER_LIMIT_REACHED',
    invalidPromoCode: 'INVALID_PROMO_CODE',
    incompatiblePromoCode: 'INCOMPATIBLE_PROMO_CODE',
    replyPosted: 'COMMENT_REPLY_POSTED',
    phoneInUse: 'PHONE_ALREADY_IN_USE',
    tooManyRequests: 'TOO_MANY_REQUESTS',
    invalidEmail: 'INVALID_EMAIL',
    invalidDate: 'INVALID_DATE',
    alreadyExists: 'ALREADY_EXISTS',
    alreadyVerified: 'ALREADY_VERIFIED',
    invalidTemplate: 'TEMPLATE_DOESNT_EXIST',
    wrongPassword: 'WRONG_PASSWORD',
    invalidPhone: 'INVALID_PHONE',
    incompleteCRMData: 'INCOMPLETE_CRM_DATA',
    ACSubscriptionDataUnset: 'COURSE_RELEASE_SUBSCRIPTION_DATA_IS_NOT_SET',
    userDeleted: 'USER_DELETED',
  };

  EXPRESS_JWT_ERROR_MESSAGES = {
    missingToken: 'No authorization token was found',
    invalidToken: 'invalid token',
    expiredToken: 'jwt expired',
  };

  TOKENS_NAME_IN_HEADER = {
    access: 'x-access-token',
    refresh: 'x-refresh-token',
  };

  MEDIACONVERT_VIDEO_NAME = {
    videoDirectory: 'videos',
    originalVideosDirectory: 'originals',
    testsDirectory: 'tests',
    original: 'original',
    converted: {
      '-360': '-360',
      '-720': '-720',
      '-1080': '-1080',
      '-4K': '-4K',
    },
    manifestExtension: '.m3u8',
    resultExtension: '.ts',
    trailerDirectory: 'trailer',
    freeLessonsDirectory: 'free-lessons',
  };

  MEDIACONVERT_ENCRYPT_URL_PART = '/api/download/videos/code';

  YANDEX_KASSA_PAYMENT_URL = 'https://payment.yandex.net/api/v3/payments';

  MEDIACONVERT_STATUS = {
    submitted: 'SUBMITTED',
    progressing: 'PROGRESSING',
    complete: 'COMPLETE',
    canceled: 'CANCELED',
    error: 'ERROR',
  };

  AWS_ERRORS = {
    wrongKey: 'NoSuchKey',
    notFound: 'NotFound',
  };

  DEV = 'development';

  USER_ROLES = {
    user: 'user',
    admin: 'admin',
    guest: 'guest',
  };

  TRANSACTION_TYPE = {
    course: 'course',
    limited: 'limited',
    pass: 'pass',
    bundle: 'bundle',
    addCard: 'addCard',
    refundForAddCard: 'refundForAddCard',
  };

  GA_PURCHASE_VARIANTS = {
    course: 'навсегда',
    limited: 'на 1 месяц',
    pass: null,
  };

  TRANSACTION_STATUSES = {
    pending: 'pending',
    succeeded: 'succeeded',
    signed: 'signed',
    errored: 'errored',
    refunded: 'refunded',
    reversed: 'reversed',
    declinedByTimeout: 'declinedByTimeout',
  };

  SPEAKER_NOTIFICATION_TYPES = {
    courseRating: 'course-rating',
    courseComment: 'course-comment',
  };

  AUTH_TYPES = {
    social: 'social',
    local: 'local',
  };

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

  SUBSCRIPTION_DURATIONS = {
    course: {
      duration: 1,
      durationUnits: 'months',
    },
    limited: {
      duration: 1,
      durationUnits: 'months',
    },
    category: {
      duration: 12,
      durationUnits: 'months',
    },
    pass: {
      duration: 12,
      durationUnits: 'months',
    },
    bundle: {
      duration: 12,
      durationUnits: 'months',
    },
    promo: {
      duration: 12,
      durationUnits: 'months',
    },
  };

  SUBSCRIPTION_VARIANTS = {
    practical: 'practical',
    infinite: 'infinite',
    limited: 'limited',
    promo: 'promo',
    year: 'year',
    month: 'month',
    quarter: 'quarter',
    main: 'main',
  };

  PAYMENT_NOTIFICATION_OPERATIONS = {
    deposited: 'deposited',
    declinedByTimeout: 'declinedByTimeout',
    reversed: 'reversed',
    refunded: 'refunded',
  };

  PAYMENT_NOTIFICATION_STATUSES = {
    success: '1',
    fail: '0',
  };

  TINKOFF_STATUSES = {
    approved: 'approved',
    signed: 'signed',
    rejected: 'rejected',
    cancelled: 'cancelled',
  };

  MAIL_TEMPLATES = {
    authConfirmation: 'authConfirmation',
    verifyEmail: 'verifyEmail',
    demoLessonRequest: 'demoLessonRequest',
    giftCourse: 'giftCourse',
    giftFullAccess: 'giftFullAccess',
    giftCategory: 'giftCategory',
    giftPass: 'giftPass',
    general: 'general',
    restorePassword: 'restorePassword',
    newAccount: 'newAccount',
    newOrder: 'newOrder',
    preOrderInitial: 'preOrderInitial',
    successfulOrder: 'successfulOrder',
    successfulOrderCourse: 'successfulOrderCourse',
    successfulOrderCourseUpsell: 'successfulOrderCourseUpsell',
    successfulOrderBundle: 'successfulOrderBundle',
    successfulOrderAllAccess: 'successfulOrderAllAccess',
    erroredOrder: 'erroredOrder',
    courseReleaseInitial: 'courseReleaseInitial',
    buyCourseGift: 'buyCourseGift',
    getCertificate: 'getCertificate',
    buyFullAccessGift: 'buyFullAccessGift',
    buyFullAccessGiftForPrint: 'buyFullAccessGiftForPrint',
    buyCourseGiftForPrint: 'buyCourseGiftForPrint',
    successfulRecurringSubscription: 'successfulRecurringSubscription',
    unpaidSubscription: 'unpaidSubscription',
    courseAvailable: 'courseAvailable',
    courseComplete: 'courseComplete',
    errorReport: 'errorReport',
    writingMarathon: 'writing22maraphonorder',
    fullYearSubscriptionCom: 'successfullYearSubscriptionCom',
    halfYearSubscriptionCom: 'successfullHalfYearSubscriptionCom',
    consultation: 'successfullApplicationCom',
    certYearSubscription: 'successfullCertYearSubscriptionCom',
  };

  AC_CONTACT_STATUSES = {
    any: -1,
    unconfirmed: 0,
    active: 1,
    unsubscribed: 2,
    bounced: 3,
  };

  AC_TAGS = {
    allClients: 4,
    allCourses: 97,
    allClientsUnpaid: 27,
    registration: 95,
    registrationAlfaCapital: 1077,
    registrationAlfaBank: 1076,
    refund: 124,
    giftSender: 140,
    giftReceiver: 141,
    discount: 139,
    consultation: 470,
    bundle: 471,
    subscription: 497,
  };

  AC_LISTS = {
    main: 1,
    discount: 57,
    consultation: 64,
    clients: 12,
    freeLessons: 67,
    webinar: 90,
    webinarPopup: 91,
    levelKitchen: 83,
    upsell: 93,
    fortuna: 96,
    photo: 102,
    motivation: 107,
    vlasovaMarathon: 128,
    writingMarathon: 129,
  };

  AC_PIPELINES = {
    noCourse: 7,
    allAccess: 17,
    bundle: 27,
    subscription: 28,
    subscriptionYear: 36,
  };

  AC_STAGES = {
    noCourse: {
      unpaid: 34,
      paid: 31,
    },
    allAccess: {
      unpaid: 56,
      paid: 57,
    },
    bundle: {
      unpaid: 105,
      paid: 104,
      refund: 106,
    },
    subscription: {
      unpaid: 108,
      paid: 107,
    },
    subscriptionYear: {
      unpaid: 132,
      paid: 131,
    },
  };

  AC_USERS = {
    admin: 1,
  };

  AC_DEAL_CUSTOM_FIELDS = {
    firstName: 8,
    lastName: 9,
    email: 10,
    phone: 11,
    orderNumber: 3,
    date: 12,
    amount: 13,
    status: 5,
    description: 7,
    paymentUrl: 14,
    renewalLink: 15,
    expirationAt: 19,
    type: 20,
    courseTitle: 34,
    isRenewed: 21,
    isPreOrder: 22,
    UTMCampaign: 24,
    UTMSource: 23,
    UTMContent: 27,
    UTMMedium: 29,
    promoCode: 30,
    UTMTerm: 31,
    orderUrl: 28,
    transactionId: 32,
    courseId: 35,
  };

  AC_CONTACT_CUSTOM_FIELDS = {
    webinarLink: 5,
  };

  AC_DEAL_STATUSES = {
    open: 0,
    won: 1,
    lost: 2,
  };

  AC_BOOLEAN = {
    true: 'да',
    false: 'нет',
  };

  PAYMENT_STATUSES = {
    success: 'Оплачен',
    pending: 'Не оплачен',
    error: 'Ошибка',
  };

  AC_SUBSCRIPTION_TYPES = {
    limited: 'месяц',
    course: 'навсегда',
    pass: 'год',
    bundle: 'коллекция',
  };

  AMO_PIPELINES = {
    registration: 3505345,
    giftRecipients: 4071028,
    recurring: 4306486,
    coldLeads: 3970843,
    hotLeads: 3970666,
  };

  AMO_STAGES = {
    registrationInitial: 34643230,
    won: 142,
    lost: 143,
    hotLeads: {
      newLead: 37849708,
    },
  };

  AMO_CUSTOM_FIELDS = {
    phone: {
      id: 164653,
      name: 'Телефон',
      code: 'PHONE',
      enum: 232047,
    },
    email: {
      id: 164655,
      name: 'Email',
      code: 'EMAIL',
      enum: 232059,
    },
    paymentDate: 663065,
    courseTitle: 314587,
    subscriptionType: 314591,
    UTMSource: 314593,
    UTMMedium: 314595,
    UTMCampaign: 314597,
    UTMContent: 314603,
    UTMTerm: 708665,
    promoCode: 322457,
    addedToCart: 678157,
    signUpReason: 727751,
    transactionId: 321511,
    orderNumber: 433751,
    vendorCodes: 678159,
    paymentType: 663037,
    paymentMethod: 663039,
    leadSource: 663047,
    courseType: 705009,
    declineReason: 663057,
    declineComment: 663059,
    UTMSourcePurchase: 727607,
    UTMMediumPurchase: 727619,
    UTMCampaignPurchase: 727623,
    UTMContentPurchase: 727629,
    UTMTermPurchase: 727631,
    UTMSourceRegistration: 727609,
    UTMMediumRegistration: 727621,
    UTMCampaignRegistration: 727625,
    UTMContentRegistration: 727627,
    UTMTermRegistration: 727633,
    adName: 729725,
    UTMSourceCookie: 729727,
    url: 686713,
    clientId: 696463,
    pageType: 731367,
    speakerName: 731369,
    coursePage: 731821,
  };

  AMO_PAGE_TYPE_ENUMS = {
    main: 480443,
    year: 480451,
    bundle: 480445,
    course: 480447,
    b2b: 480449,
  };

  AMO_COURSE_PAGE_ENUMS = {
    main: 480921,
  };

  AMO_RESPONSIBLE_USERS = {
    administrator: 5743096,
  };

  AMO_VENDOR_CODE_ENUMS = {
    month: 470419,
    quarter: 470417,
    halfyear: 483587,
    year: 459783,
    main: 459783,
    anyCourse: 473853,
  };

  AMO_DECLINE_REASON_ENUMS = {
    test: 459785,
    refund: 468975,
  };

  AMO_PAYMENT_TYPE_ENUMS = {
    cloudpayments: 459295,
    installment: 459293,
    paypal: 468969,
    paymentnut: 482421,
    appex: 483067,
  };

  AMO_PAYMENT_METHOD_ENUMS = {
    website: 459299,
  };

  AMO_LEAD_SOURCE_ENUMS = {
    website: 459311,
  };

  AMO_COURSE_TYPE_ENUMS = {
    bundle: 468959,
    single: 468961,
    year: 468963,
    practical: 468965,
    subscription: 469871,
    marathon: 481561,
    meet: 485639,
  };

  AMO_TAGS = {
    leads: {
      watchCourse: 351439,
      A: 354265,
      B: 354261,
      R: 354255,
      autoPayment: 354263,
      test: 354463,
      allAccessPage: 372425,
      bundlePage: 372427,
      credit: 353349,
      COMBuy: 433153,
      COMGift: 433151,
    },
    contacts: {
      test: 297415,
    },
  };

  AMO_LEAD_TRIGGERS = {
    signUp: 'signUp',
    freeLessonRequest: 'freeLessonRequest',
    discountRequest: 'discountRequest',
    creditRequest: 'creditRequest',
    practiceRequest: 'practiceRequest',
    purchaseRequest: 'purchaseRequest',
    upsell: 'upsell',
    gameLead: 'gameLead',
    marathon: 'marathon',
  };

  TWILIO_ERROR_CODES = {
    invalidNumber: 21211,
  };

  SMSC_ERROR_CODES = {
    invalidNumber: 7,
    tooManyRequests: 9,
  };

  CURRENCY_CODE_RUB = 643;

  ALLOWED_VISIT_IDLE_TIME_MIN = 30;

  PROMOCODE_DISCOUNT_UNITS = {
    ruble: 'ruble',
    percent: 'percent',
  };

  PAYMENT_EXPIRATION_DAYS = 8;
  HIDDEN_EMAIL_REGEX = /(?<=^[A-Za-z0-9.]{2}).*?(?=@)/;

  PAYMENT_ACQUIRERS = {
    sberbank: 'sberbank',
    tinkoff: 'tinkoff',
    paypal: 'paypal',
    cloudpayments: 'cloudpayments',
    paymentnut: 'paymentnut',
    appex: 'appex',
  };

  PAYMENT_TYPES = {
    credit: 'credit',
    installment: 'installment',
  };

  TINKOFF_CREDIT_CODES = {
    installment3: 'installment_0_0_3_3',
    installment6: 'installment_0_0_6_5,5',
    credit: 'default',
  };

  CP_PAYMENT_STATUSES = {
    authorized: 2,
  };

  CP_SUBSCRIPTION_STATUSES = {
    active: 'Active',
    pastDue: 'PastDue',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    expired: 'Expired',
  };

  KASSIR_PROMOCODE_TYPES = {
    select: 'select',
  };

  GIFT_TYPES = {
    email: 'email',
    print: 'print',
  };

  PAYMENT_STATUS_TRIGGERS = {
    amoSync: 'amoSync',
  };

  COURSE_CERTIFICATE_TYPES = {
    regular: 'regular',
    practical: 'practical',
  };

  AC_FORTUNA_GIFT_TAGS = {
    FortunaSale: 681,
    Fortuna2k: 682,
    FortunaYear: 683,
    FortunaFifteen: 684,
  };

  S3_BASE_URL = 'https://legend-lessons.s3.eu-central-1.amazonaws.com/';
}
