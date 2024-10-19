const azurestorage = require("azure-storage");
const catchAsync = require("../../utils/catchAsync");
const intoStream = require("into-stream");
const Franchise = require("../../db/models/franchise");
const AppError = require("../../utils/appError");
const defineBusinessLoanUnsecuredNew = require("../../db/models/businessloanunsecurednew");
const { Op } = require("sequelize");

const containerName = "imagecontainer";
const blobService = azurestorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const uploadBlob = async (file) => {
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
          return reject(err);
        }
        const blobUrl = blobService.getUrl(containerName, blobName);
        resolve(blobUrl);
      }
    );
  });
};


const businessLoanUnsecuredNew = catchAsync(async (req,res,next)=>{

    try {
        
        const {
            customerName,
            phoneNumber,
            email,
            cibilScore,
            loanAmount,
            cibil
           } =req.body;
        
           if(!req.body){
            return next(new AppError("Fields are required", 400));
           }
        
           if(!req.files){
            return next(new AppError("Files not uploaded", 400));
           }

           const multipleUploadFile = async (files) => {
            if (!Array.isArray(files)) {
              files = [files]; 
            }
            const uploadPromises = files.map((file) => uploadFile(file));
            const uploadedUrls = await Promise.all(uploadPromises);
            return uploadedUrls;
          };

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
         const count = await defineBusinessLoanUnsecuredNew(cibil).count({
             where: {
                 workId: {
                     [Op.like]: `${currentDate}BLUN%`,
                 },
             },
         });
         const workId = `${currentDate}BLUN${(count + 1).toString().padStart(3, '0')}`;

         const businessLoanUnsecuredNew = defineBusinessLoanUnsecuredNew(cibil)

         const newBusinessLoanUnsecuredNew = await businessLoanUnsecuredNew.create({
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
            invoiceCopyOfAssetsToPurchase:await uploadFile(req.files.invoiceCopyOfAssetsToPurchase),
            rentAgreement:await uploadFile(req.files.rentAgreement),
            licenceCopy:await uploadFile(req.files.licenceCopy),
            otherDocuments:await multipleUploadFile(req.files.otherDocuments),
            createdAt: new Date(),
            updatedAt: new Date(),
         })

         console.log(newBusinessLoanUnsecuredNew)
         res.status(201).json({newBusinessLoanUnsecuredNew})

    } catch (error) {
        console.error("Error in new unsecured business loan creation:", error);
    res.status(500).json({ error: "Failed on new unsecured business loan creation" });
    }
})


module.exports = {businessLoanUnsecuredNew}