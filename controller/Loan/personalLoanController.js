const azurestorage = require("azure-storage");
const intoStream = require("into-stream");
const catchAsync= require('../../utils/catchAsync');
const AppError = require("../../utils/appError");
const definePersonalLoan = require("../../db/models/personalloan");
const Franchise = require("../../db/models/franchise");
const {  Op } = require('sequelize'); 


const containerName = "imagecontainer";
const blobService = azurestorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const uploadBlob = (file) => {
  return new Promise((resolve, reject) => {
    const blobName = file.name;
    const stream = intoStream(file.data);
    const streamLength = file.data.length;

    blobService.createBlockBlobFromStream(
      containerName,
      blobName,
      stream,
      streamLength,
      (err) => {
        if (err) {
          return reject(`Error uploading file ${blobName}: ${err.message}`);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};


const  personalLoan = catchAsync( async(req,res,next)=>{
try {
   const {
    customerName,
    phoneNumber,
    email,
    cibilScore,
    loanAmount,
    salariedOrBusiness,
    cibil
   } =req.body;

   if(!req.body){
    return next(new AppError("Fields are required", 400));
   }

   if(!req.files){
    return next(new AppError("Files not uploaded", 400));
   }

   const uploadFile = async (file) => {
    if (file) {
        try {
            return await uploadBlob(file);
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            return null;
        }
    } else {
        console.error("File is missing:", file);
        return null;
    }
};


const user = req.user;
if (!user) {
    return next(new AppError("User not found", 401));
}

const franchise = await Franchise.findOne({
    where: { email: user.email },
});

const uniqueId = franchise.franchiseUniqueId;
if (!uniqueId) {
    return next(new AppError("Missing unique id for the franchise", 400));
}

 // Generate the workId
 const currentDate = new Date().toISOString().slice(0, 10).split('-').reverse().join('');
 const count = await definePersonalLoan(salariedOrBusiness,cibil).count({
     where: {
         workId: {
             [Op.like]: `${currentDate}PL%`,
         },
     },
 });
 const workId = `${currentDate}PL${(count + 1).toString().padStart(3, '0')}`;

const personalLoan=definePersonalLoan(salariedOrBusiness,cibil)

const newPersonalLoan = await personalLoan.create({
  uniqueId,
  workId,
  customerName,
  phoneNumber,
  email,
  cibil,
  cibilScore:cibil === 'true' ? cibilScore : null,
  cibilReport:cibil === 'true' ? await uploadFile(req.files.cibilReport) : null,
  cibilAcknowledgement: cibil === "false" ? await uploadFile(req.files.cibilAcknowledgement) : null,
  loanAmount,
  sourceOfIncome:await uploadFile(req.files.sourceOfIncome),
  salariedOrBusiness,
  salarySlip:salariedOrBusiness==="salaried"? await uploadFile(req.files.salarySlip):null,
  bankStatement:await uploadFile(req.files.bankStatement),
  itr:salariedOrBusiness==="business"?await uploadFile(req.files.itr):null,
  rentAgreement:salariedOrBusiness==="business"?await uploadFile(req.files.rentAgreement):null,
  panchayathLicence:salariedOrBusiness==="business"?await uploadFile(req.files.panchayathLicence):null,
  cancelledCheque:await uploadFile(req.files.cancelledCheque),
  photo:await uploadFile(req.files.photo),
  createdAt: new Date(),
  updatedAt: new Date(),
})

console.log(newPersonalLoan);
res.status(201).json({ newPersonalLoan });


} catch (error) {
    console.error("Error in personal loan creation:", error);
    res.status(500).json({ error: "Failed on personal loan creation" });
}
})

module.exports ={personalLoan}