const { restrictTo } = require("../controller/authController");
const {
  DMTsendOtp,
  DMTuserCreate,
  DMTuserFetch,
  DMTfetchAllRecipientsOfUser,
  DMTaddBeneficery,
  DMTfetchSingleBeneficery,
  DMTdeleteBeneficery,
  DMTremitAPI,
  DMTneftAPI,
  DMTaccountVerification,
  DMTcheckWalletBalanceAPI,
  DMTtranscationStatusCheckAPI,
  DMTfetchBankList,
  DMTcallBackUrl,
  DMTbankDownApi,
} = require("../controller/dmtController");

const {verifyToken, verifyRefreshToken, externalServiceAuthMiddleware} = require('../utils/token')

const router = require("express").Router();


router.route("/DMTsendOtp").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTsendOtp);
router.route("/DMTuserCreate").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTuserCreate); 
router.route("/DMTuserFetch").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTuserFetch);
router.route("/DMTfetchAllRecipientsOfUser").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTfetchAllRecipientsOfUser);

router.route("/DMTaddBeneficery").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTaddBeneficery);
router.route("/DMTfetchSingleBeneficery").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTfetchSingleBeneficery);
router.route("/DMTdeleteBeneficery").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTdeleteBeneficery);

router.route("/DMTremitAPI").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTremitAPI);//
router.route("/DMTneftAPI").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTneftAPI);

router.route("/DMTaccountVerification").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTaccountVerification);
router.route("/DMTcheckWalletBalanceAPI").get(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTcheckWalletBalanceAPI); ///issue in this 
router.route("/DMTtranscationStatusCheckAPI").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTtranscationStatusCheckAPI);

router.route("/DMTfetchBankList").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTfetchBankList);
router.route("/DMTcallBackUrl").post(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTcallBackUrl); ///issue in this 
router.route("/DMTbankDownApi").get(verifyToken,verifyRefreshToken,externalServiceAuthMiddleware,DMTbankDownApi); ///issue in this



module.exports = router;