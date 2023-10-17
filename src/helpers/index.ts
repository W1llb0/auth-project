import { Cron } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as request from 'request-promise';
import * as uuid4 from 'uuid';
import * as shortid from 'shortid';
import * as jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import * as crypto from 'crypto';
import * as passwordGenerator from 'generate-password';
import { promisify } from 'util';
import * as twilio from 'twilio';
import axios from 'axios';
// Для Redis, необходимо установить и импортировать модуль NestJS-Redis
import { RedisService } from 'nestjs-redis';
// Для Nodemailer, необходимо установить и импортировать модуль NestJS-Nodemailer
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaClient } from '@prisma/client';
import mediaConvert from '../config/aws/index'
import s3 from '../config/aws/index'
import { MAIL_SERVICE as mailerConfig } from 'src/config/mailer';

export class HelpersIndex {
  constructor(private prisma: PrismaClient) {}

const { printer, styles } = require('../config/pdfmake');
const getPriceAdjustments = require('../helpers/getPriceAdjustments');

const PHONE_REGEX = /^\+[0-9]{11}$/;
const unioneApi = new Unione();

async function checkMediaConvertJob(id) {
  try {
    const { Job } = await mediaConvert.getJob({ Id: id }).promise();

    await MediaConvertJobs.update(
      {
        status: Job.Status,
      },
      {
        where: {
          jobId: id,
        },
      },
    );

    if (Job.Status === MEDIACONVERT_STATUS.complete) {
      const {
        Settings: {
          OutputGroups: [{ CustomName }],
        },
        OutputGroupDetails: [
          {
            OutputDetails: [{ DurationInMs }],
          },
        ],
      } = Job;

      const [, videoName] = CustomName.split('/');
      const { id: videoId } = await Videos.findOne({
        where: {
          filename: videoName,
        },
      });
      await Videos.update(
        { duration: Math.floor(DurationInMs / 1000) },
        { where: { id: videoId } },
      );
      const outputVideoKeys = Object.keys(MEDIACONVERT_VIDEO_NAME.converted);

      await VideoList.bulkCreate([
        {
          videoId,
          name: `${MEDIACONVERT_VIDEO_NAME.original}${MEDIACONVERT_VIDEO_NAME.manifestExtension}`,
        },
        ...outputVideoKeys.map((key) => {
          const prefix = MEDIACONVERT_VIDEO_NAME.converted[key];

          return {
            videoId,
            name: `${MEDIACONVERT_VIDEO_NAME.original}${prefix}${MEDIACONVERT_VIDEO_NAME.resultExtension}`,
          };
        }),
      ]);
    }
  } catch (e) {
    console.log('checkMediaConvertJob error, id:', id, e);
  }
}

const calculateDateDifference = (olderDate, date = undefined) => {
  const firstDate = moment(date).startOf('day');
  const secondDate = moment(olderDate).startOf('day');
  return secondDate.diff(firstDate, 'days');
};

const helpers = {
  sendResponse: ({
    req,
    res,
    status = 200,
    info = SERVER_MESSAGES.ok,
    data = null,
  }) =>
    res.status(status).send({
      datetime: Date.now(),
      status,
      info,
      data,
      request: `${req.originalUrl} [${req.method}]`,
    }),
  sendError: ({
    req,
    res,
    type = SERVER_MESSAGES.internalServerError,
    status = 500,
    error,
    misc = SERVER_MESSAGES.noAdditionalInformation,
  }) => {
    const errorMessage = error.stack || error.message || error;
    if (ENV === DEV) {
      console.log('type:', type, 'error:', errorMessage, 'misc:', misc);
    }

    const errorBody = {
      datetime: Date.now(),
      error: type,
      info: errorMessage,
      misc,
      request: `${req.originalUrl} [${req.method}]`,
      status,
    };

    if (Object.values(SERVER_MESSAGES).includes(error.message)) {
      errorBody.error = error.message;
      errorBody.info = error.message;
      errorBody.status = 400;
    }

    return res.status(status).send(errorBody);
  },
  checkVideoList: () => {
    try {
      const task = cron.schedule(
        '* * * * *',
        async () => {
          const notCompletedJobList = await MediaConvertJobs.findAll({
            where: {
              status: {
                [Op.or]: [
                  MEDIACONVERT_STATUS.submitted,
                  MEDIACONVERT_STATUS.progressing,
                ],
              },
            },
          });

          await Promise.all(
            notCompletedJobList.map((item) => checkMediaConvertJob(item.jobId)),
          );
          if (ENV === DEV) {
            console.log('mediaConvert jobs checked');
          }
        },
        {
          scheduled: false,
        },
      );
      task.start();
    } catch (e) {
      console.log('checkVideoList error', e);
    }
  },

  isValidPassword: (user, password) => bCrypt.compare(password, user.password),
  uploadFromURL: async ({ url, directory }) => {
    const { headers, data } = await request({
      url,
      encoding: null,
      transform(body, res) {
        return { headers: res.headers, data: body };
      },
    });

    const ext = headers['content-type'].split('/')[1];

    const key = `${directory}/${uuid4()}.${ext}`;

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      ContentType: headers['content-type'],
      ContentLength: headers['content-length'],
      Body: data,
    };

    await s3.putObject(params).promise();

    return key;
  },
  findTopRatedVideos: (videos) => {
    const ratings = videos.map((video) => {
      const averageRating =
        video.ratings.reduce((acc, item) => acc + item.rating, 0) /
        video.ratings.length;
      return { id: video.id, rating: averageRating };
    });
    const sorted = ratings.sort((a, b) => {
      if (a.rating > b.rating) {
        return -1;
      }
      if (a.rating < b.rating) {
        return 1;
      }
      if (a.rating === b.rating) {
        return 0;
      }
      return 0;
    });
    return sorted.slice(0, 4).map((video) => video.id);
  },
  generateTokens: async (userId) => {
    const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: Number(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });

    const code = await bCrypt.hash(`${userId}-${Date.now()}`, 10);
    const refreshToken = jwt.sign({ code }, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: Number(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });
    return {
      accessToken,
      refreshToken,
      refreshTokenCode: code,
    };
  },
  /**
   * Send an email
   * @param address {string} - target address
   * @param subject {string} - message subject
   * @param message {string} - message
   */
  sendEmail: async (address, subject, message, attachments) => {
    try {
      const mailer = createTransport({
        service: mailerConfig.MAIL_SERVICE.service,
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: mailerConfig.MAIL_SERVICE.email,
          pass: mailerConfig.MAIL_SERVICE.password,
        },
      });

      const options = {
        from: `Уроки Легенд <${mailerConfig.MAIL_SERVICE.email}>`,
        to: address,
        subject,
        html: message,
        attachments,
      };

      await mailer.sendMail(options, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
    } catch (e) {
      throw e;
    }
  },
  sendSupportEmail: async (name, email, message) => {
    try {
      const mailer = createTransport({
        service: mailerConfig.MAIL_SERVICE.service,
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: mailerConfig.MAIL_SERVICE.email,
          pass: mailerConfig.MAIL_SERVICE.password,
        },
      });

      const options = {
        from: `Уроки Легенд <${mailerConfig.MAIL_SERVICE.email}>`,
        to: SUPPORT_EMAIL,
        subject: 'Обращение в поддержку',
        html: message,
      };

      await mailer.sendMail(options, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
    } catch (e) {
      throw e;
    }
  },
  encrypt: async (text) => {
    const cipher = await crypto.createCipheriv(
      CRYPTO_ALGORITHM,
      Buffer.from(CRYPTO_KEY, 'hex'),
      Buffer.from(CRYPTO_IV_VECTOR, 'hex'),
    );
    let encrypted = await cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },
  // not needed, but let it be
  decrypt: async (text) => {
    const decipher = await crypto.createDecipheriv(
      CRYPTO_ALGORITHM,
      Buffer.from(CRYPTO_KEY, 'hex'),
      Buffer.from(CRYPTO_IV_VECTOR, 'hex'),
    );
    const encryptedText = Buffer.from(text, 'hex');
    let decrypted = await decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },
  generateStaticKey: async () => crypto.randomBytes(16).toString('hex'),
  redisGet: promisify(redisClient.get).bind(redisClient),
  redisSet: promisify(redisClient.set).bind(redisClient),
  checkAvailablePurchase: (oldExpirationAt) => {
    if (!oldExpirationAt) {
      return true;
    }

    const dayLeft = calculateDateDifference(oldExpirationAt);

    if (dayLeft <= 5) {
      return true;
    }
    return false;
  },

  calculateExpirationAt: ({
    capturedAt,
    duration,
    durationUnits,
    oldExpirationAt,
    extended,
    extensionAmount,
  }) => {
    let dayLeft = calculateDateDifference(oldExpirationAt);
    dayLeft = dayLeft > 0 ? dayLeft : 0;

    const adjustedDuration = extended ? duration + extensionAmount : duration;

    return moment(capturedAt)
      .add(adjustedDuration, durationUnits)
      .add(dayLeft, 'd')
      .format();
  },
  xor: (a, b) => (a ? !b : Boolean(b)),
  generatePassword: (length = 10) =>
    passwordGenerator.generate({ length, numbers: true }),

  generateString: (length = 32) => {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  },

  generateShortString: () => {
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@',
    );
    return shortid.generate().toUpperCase();
  },

  generateSMSCode: () => Math.floor(100000 + Math.random() * 900000),

  validatePassword(password = '') {
    const trimmedPassword = password.trim();
    return Boolean(trimmedPassword && trimmedPassword.length >= 6);
  },

  checkPassword: (password = '', hash = '') => bCrypt.compare(password, hash),

  hashPassword: (password) =>
    bCrypt.hashSync(password, bCrypt.genSaltSync(10), null),

  validateEmail(email) {
    const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.[a-z]{2,4}$/i;
    return EMAIL_REGEX.test(String(email).toLowerCase());
  },

  validatePhone(phone) {
    return !!phone.match(PHONE_REGEX);
  },

  sendEmailVerifyCode: async (
    userId,
    email,
    config = {
      repeat: false,
    },
  ) => {
    const { repeat } = config;
    let verificationCode;
    if (repeat) {
      const existingCode = await VerifyEmailCodes.findOne({
        where: {
          userId,
          isUsed: false,
        },
      });
      if (!existingCode) {
        throw new Error(SERVER_MESSAGES.accessDenied);
      }
      verificationCode = existingCode.code;
    } else {
      verificationCode = helpers.generateString();
      await VerifyEmailCodes.create({
        code: verificationCode,
        userId,
      });
    }

    const verifyLink = `${PATH_TO_CLIENT}?verify=${verificationCode}`;

    await helpers.sendUnioneEmail(
      [
        {
          email,
          substitutions: {
            verifyLink,
          },
        },
      ],
      MAIL_TEMPLATES.verifyEmail,
    );
  },

  sendEmailSignUpCode: async (email, config = {}) => {
    const { repeat = false, subdomainModifier } = config;

    let verificationCode;
    if (repeat) {
      const existingCode = await SignUpEmailCodes.findOne({
        where: {
          email,
          isUsed: false,
        },
      });
      if (!existingCode) {
        throw new Error(SERVER_MESSAGES.accessDenied);
      }
      verificationCode = existingCode.code;
    } else {
      verificationCode = helpers.generateString();
      await SignUpEmailCodes.create({
        code: verificationCode,
        email,
      });
    }

    const baseUrl = subdomainModifier
      ? `https://${subdomainModifier}.urokilegend.ru`
      : PATH_TO_CLIENT;

    const verifyLink = `${baseUrl}?verify=${verificationCode}`;

    await helpers.sendUnioneEmail(
      [
        {
          email,
          substitutions: {
            verifyLink,
          },
        },
      ],
      MAIL_TEMPLATES.verifyEmail,
    );
  },

  sendSMSVerifyCode: async (phone) => {
    try {
      const code = helpers.generateSMSCode();

      // const code = await helpers.sendHangUpCall(phone);

      await PhoneConfirmationCodes.create({
        phone,
        code,
      });

      await helpers.sendSMS(phone, `Код подтверждения: ${code}`);
    } catch (e) {
      throw e;
    }
  },

  sendSMSCodeViaEmail: async (phone, email) => {
    try {
      const verificationCode = helpers.generateSMSCode();

      if (phone) {
        await PhoneConfirmationCodes.create({
          phone,
          code: verificationCode,
        });
      }

      await helpers.sendUnioneEmail(
        [
          {
            email,
            substitutions: {
              code: verificationCode,
            },
          },
        ],
        MAIL_TEMPLATES.authConfirmation,
      );
    } catch (e) {
      throw e;
    }
  },

  sendHangUpCall: async (number) => {
    try {
      return await axios
        .get('https://smsc.ru/sys/send.php', {
          params: {
            login: SMSC_LOGIN,
            psw: SMSC_PASSWORD,
            phones: number,
            mes: 'code',
            fmt: 3,
            call: 1,
          },
        })
        .then(({ data }) => {
          if (data && data.error) {
            console.log(data.error_code);
            throw data.error;
          }
          return data.code;
        });
    } catch (e) {
      switch (e) {
        case SMSC_ERROR_CODES.invalidNumber:
          throw new Error(SERVER_MESSAGES.invalidPhone);
        case SMSC_ERROR_CODES.tooManyRequests:
          throw new Error(SERVER_MESSAGES.tooManyRequests);
        default:
          throw new Error(SERVER_MESSAGES.accessDenied);
      }
    }
  },

  sendSMS: async (number, message) => {
    try {
      return await axios
        .get('https://smsc.ru/sys/send.php', {
          params: {
            login: SMSC_LOGIN,
            psw: SMSC_PASSWORD,
            phones: number,
            mes: message,
            fmt: 3,
          },
        })
        .then(({ data }) => {
          if (data && data.error) {
            console.log(data.error_code);
            throw data.error;
          }
        });
    } catch (e) {
      switch (e) {
        case SMSC_ERROR_CODES.invalidNumber:
          throw new Error(SERVER_MESSAGES.invalidPhone);
        case SMSC_ERROR_CODES.tooManyRequests:
          throw new Error(SERVER_MESSAGES.tooManyRequests);
        default:
          throw new Error(SERVER_MESSAGES.accessDenied);
      }
    }
  },

  countSpeakerShare: async (id, amount) => {
    const customCommissionExists = await CustomCommissions.findOne({
      where: { speakerId: id },
    });
    let commission = 0;
    if (customCommissionExists) {
      commission = customCommissionExists.commission;
    } else {
      [{ commission }] = await Subtractions.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
      });
    }

    return (amount * commission) / 100;
  },

  isNumeric: (value) => !Number.isNaN(Number(value)),

  calculateAverageRating: (ratings) => {
    const elemCount = ratings.length;
    const ratingSum = ratings.reduce((sum, item) => sum + item.rating, 0);
    return elemCount ? ratingSum / elemCount : null;
  },

  updateOrCreate: async (model, values, condition) => {
    try {
      const object = await model.findOne({
        where: condition,
      });

      if (object) {
        return object.update(values);
      }

      return model.create(values);
    } catch (e) {
      throw e;
    }
  },

  checkCourseAvailability: async (userId, courseId) => {
    try {
      const { categoryId, available } = await Courses.findOne({
        where: { id: courseId },
      });

      const query = `
      SELECT
        MAX(s."expirationAt") AS expires, s."relatedItemId", s.type
            FROM "Subscriptions" s
            LEFT JOIN "CourseBundles" cb ON cb."courseId"= :courseId
            LEFT JOIN "Courses" c ON c.id = :courseId
            WHERE "userId" = :userId
            AND (s.type = 'course' AND s."relatedItemId" = :courseId
              OR s.type = 'category' AND s."relatedItemId" = :categoryId
              OR s.type = 'bundle' AND s."relatedItemId" = cb."bundleId"
              OR s.type = 'pass' AND c."includeInPass" = true)
            GROUP BY s.type, s."relatedItemId"
            HAVING MAX(s."expirationAt")>CURRENT_TIMESTAMP
      `;

      const [haveAccess] = await sequelize.query(query, {
        replacements: {
          userId,
          courseId,
          categoryId,
        },
      });

      return (!!haveAccess.length && available) || [54].includes(courseId);
    } catch (error) {
      throw error;
    }
  },

  checkPromoCode: async (promoData, userId, type, relatedItemId) => {
    try {
      const restrictionType = ['course', 'limited'].includes(type)
        ? 'course'
        : type;

      if (!promoData) {
        return false;
      }

      const {
        relatedItemId: codeRelatedItemId,
        type: codeSubscriptionType,
        compatibleWithDiscounts,
        amount,
        code,
        // userId: codeUserId,
      } = promoData;

      if (codeRelatedItemId && codeRelatedItemId !== relatedItemId) {
        return false;
      }

      if (codeSubscriptionType && codeSubscriptionType !== restrictionType) {
        return false;
      }

      // if (codeUserId && codeUserId !== userId) {
      //   return false;
      // }

      if (amount <= 0) {
        return false;
      }

      const relatedItemPriceData = await SubscriptionPrices.findOne({
        where: {
          type,
          relatedItemId,
        },
        include: {
          model: SubscriptionDiscounts,
          as: 'discount',
        },
      });

      if (!relatedItemPriceData) {
        throw new Error(SERVER_MESSAGES.accessDenied);
      }

      const { discount: relatedItemDiscount } = relatedItemPriceData;

      if (relatedItemDiscount && !compatibleWithDiscounts) {
        throw new Error(SERVER_MESSAGES.incompatiblePromoCode);
      }

      const codeIsUsed = await UsedPromoCodes.findOne({
        where: { userId, code },
      });

      return !codeIsUsed;
    } catch (error) {
      throw error;
    }
  },

  checkTestAvailability: async (userId, courseId) => {
    try {
      const videosWithProgress = await Videos.findAll({
        where: {
          courseId,
        },
        include: {
          model: VideoProgress,
          as: 'progress',
          required: true,
          where: {
            userId,
          },
        },
      });

      return !!videosWithProgress.length;
    } catch (error) {
      throw error;
    }
  },

  formatSecondsToString: (sec, colon) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec - h * 3600) / 60);
    const s = Math.round(sec - h * 3600 - m * 60);
    return colon ? `${m}:${`0${s}`.slice(-2)}` : `${m} мин. ${s} сек.`;
  },

  generatePdf: async (content, callback) => {
    try {
      const doc = printer.createPdfKitDocument({
        ...styles,
        content,
      });

      const chunks = [];

      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        callback(Buffer.concat(chunks));
      });

      doc.end();
    } catch (err) {
      throw err;
    }
  },

  formatDateCell: ({ start, end }, group) => {
    switch (group) {
      case 'hour':
        return start.format('D.MM.YYYY hh:mm');
      case 'week':
        return `${start.format('D.MM.YYYY')} - ${end.format('D.MM.YYYY')}`;
      case 'month':
        return start.format('MMMM YYYY');
      case 'quarter':
        return `${start.format('D.MM.YYYY')} - ${end.format('D.MM.YYYY')}`;
      case 'year':
        return start.format('YYYY');
      default:
        return start.format('D.MM.YYYY');
    }
  },

  sendUnioneEmail: async (
    recipients,
    templateName,
    config = {},
    attachments,
  ) => {
    const { messageConfig, substitutions } = config;

    try {
      const template = await MailTemplates.findOne({
        where: {
          name: templateName,
        },
      });
      if (!template) {
        throw new Error(SERVER_MESSAGES.invalidTemplate);
      }
      const { templateId } = template;
      const { vkontakte, facebook, instagram, youtube } =
        await helpers.getSocialLinks();

      const response = await unioneApi.sendMail({
        message: {
          ...messageConfig,
          template_id: templateId,
          templateEngine: 'simple',
          from_email: UNIONE_SOURCE_EMAIL,
          track_links: 1,
          track_read: 1,
          global_substitutions: {
            ...(substitutions || {}),
            vkontakte,
            facebook,
            instagram,
            youtube,
          },
          recipients,
          attachments,
        },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  },
  generateOrderNumber: async (userId, transactionId) => {
    try {
      return `${userId}-${transactionId}`;
    } catch (e) {
      throw e;
    }
  },

  getSocialLinks: async () => {
    try {
      const links = await SocialLinks.findAll();

      return links.reduce(
        (result, { type, link }) => ({
          ...result,
          [type]: link,
        }),
        {},
      );
    } catch (e) {
      throw e;
    }
  },

  sendOrderInfoEmailToAdmin: async (
    {
      order,
      date,
      amount,
      description,
      status,
      user: { firstName, lastName, email, phone },
    },
    template,
  ) => {
    try {
      const substitutions = {
        order,
        date: moment(date).format('DD.MM.YYYY'),
        status,
        amount: `${amount} руб.`,
        description,
        firstName,
        lastName,
        email,
        phone,
      };

      await helpers.sendUnioneEmail(
        [
          {
            email: ORDER_INFO_TARGET_EMAIL,
            substitutions,
          },
          ...(ENV === 'production'
            ? [
                {
                  email: 'svetlana@urokilegend.ru',
                  substitutions,
                },
                {
                  email: 'rybalov_alexandr@urokilegend.ru',
                  substitutions,
                },
              ]
            : []),
        ],
        template,
      );
    } catch (e) {
      throw e;
    }
  },

  makePaymentUrl: (transactionId, acquirer = 'sberbank') => {
    switch (acquirer) {
      case 'tinkoff':
        return `${TINKOFF_PAYMENT_BASE_URL}${transactionId}`;
      case 'cloudpayments':
        return `${PATH_TO_CLIENT}?abandonedOrder=${transactionId}`;
      default:
        return `${SBERBANK_PAYMENT_BASE_URL}${transactionId}`;
    }
  },
  makeAbandonedPaymentUrl: (transactionId) =>
    `${PATH_TO_SERVER}/api/payment/abandoned?orderId=${transactionId}`,
  normalizeLessonOrderValues: async (entity, courseId) => {
    try {
      const { noIntro } = await Courses.findOne({
        where: {
          id: courseId,
        },
      });
      const courseLessons = await entity.findAll({
        where: {
          courseId,
        },
        order: [['order', 'ASC']],
      });

      const orderUpdates = courseLessons.map((lesson, index) =>
        lesson.update({ order: noIntro ? index + 1 : index }),
      );

      await Promise.all(orderUpdates);
    } catch (e) {
      throw e;
    }
  },
  emitGAEvent: async ({
    cid: originalCID = '',
    ti,
    tr,
    tcc,
    pr1nm,
    pr1id,
    pr1pr,
    pr1va,
    pr1ca,
    userId,
    type,
  }) => {
    try {
      const cd4 = GA_PURCHASE_VARIANTS[type];
      const cid = originalCID.substring(6);
      await axios('http://www.google-analytics.com/collect', {
        method: 'post',
        params: {
          v: 1,
          t: 'event',
          tid: GOOGLE_ANALYTICS_ID,
          cid,
          ec: 'Enhanced Ecommerce',
          ea: 'Purchase',
          cu: 'RUB',
          pa: 'purchase',
          ti,
          ta: 'Online Store',
          tr,
          tt: 5,
          ts: 5,
          tcc,
          pr1nm,
          pr1id,
          pr1pr,
          pr1va,
          pr1ca: pr1ca || null,
          pr1qt: 1,
          pr1br: 'Уроки Легенд',
          cd2: cid,
          cd3: pr1nm,
          cd4,
          cd5: pr1pr,
          cd6: userId,
        },
      });
    } catch (e) {
      throw e;
    }
  },
  calculateDiscountPrice: ({ price, promoData }) => {
    if (promoData) {
      const { units, discount, maxDiscount } = promoData;

      if (maxDiscount) {
        return 2;
      }

      return units === PROMOCODE_DISCOUNT_UNITS.ruble
        ? price - discount
        : Math.round(price - (price * discount) / 100);
    }
    return price;
  },

  calculateFinalPrice: ({
    subscriptionPriceData: { amount: price, discount, adjustments },
    promoData,
  }) => {
    // todo investigate null discount problem
    const { newPrice: discountPrice } = discount || {};
    const { adjustedPrice } = getPriceAdjustments(adjustments);
    return helpers.calculateDiscountPrice({
      price: adjustedPrice || discountPrice || price,
      promoData,
    });
  },
  promoCodeInfoString: (strings, promoData) => {
    if (promoData) {
      const { discount, units, code, maxDiscount } = promoData;

      if (maxDiscount) {
        return `, Промо-код: ${code}`;
      }

      return `, Промо-код: ${code} (-${discount}
        ${units === PROMOCODE_DISCOUNT_UNITS.ruble ? 'руб.' : '%'})`;
    }
    return '';
  },
  makeUTMQuery: (UTMData) => {
    const entries = Object.entries(UTMData);
    const formattedValues = entries.reduce((result, [key, value]) => {
      if (value) {
        return [...result, `utm_${key}=${value}`];
      }
      return result;
    }, []);
    return formattedValues.join('&');
  },

  makeAmoCustomFieldsArray: (customFields) =>
    Object.entries(customFields).flatMap(([key, value]) => [
      ...(value
        ? [
            {
              id: AMO_CUSTOM_FIELDS[key],
              values: Array.isArray(value) ? value : [{ value }],
            },
          ]
        : []),
    ]),

  makeAmoTagsArray: ({ tags, entity = 'leads' }) =>
    tags.reduce((result, item) => {
      if (AMO_TAGS[entity][item]) {
        return [...result, AMO_TAGS[entity][item]];
      }
      return result;
    }, []),

  makeActiveCampaignCustomFieldsArray: (customFields) =>
    Object.entries(customFields).flatMap(([key, value]) => [
      ...(value
        ? [
            {
              customFieldId: AC_DEAL_CUSTOM_FIELDS[key],
              fieldValue: value,
            },
          ]
        : []),
    ]),

  createUTMEntries: (transactionId, UTMData = {}) => {
    const UTMEntries = Object.entries(UTMData).map(([type, value]) => ({
      type,
      value,
      transactionId,
    }));
    return TransactionUTMData.bulkCreate(UTMEntries);
  },
  shallowEqual: (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  },
  objectIsEmpty: (obj) =>
    Object.keys(obj).length === 0 && obj.constructor === Object,
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

}
