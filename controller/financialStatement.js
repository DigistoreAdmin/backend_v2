const azurestorage = require("azure-storage");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const financialstatements = require("../db/models/financialstatements");
const Franchise = require("../db/models/franchise");
const intoStream = require("into-stream");
const bcrypt = require('bcrypt')


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


const financialStatement= catchAsync(async(req,res,next)=>{
    try {
        const {
            customerName,
            businessName,
            businessType,
            mobileNumber,
            email,
            gstUsername,
            gstPassword,
        } =req.body

        if(!customerName || !businessName || !businessType || !mobileNumber || !email || !gstUsername || !gstPassword){
            return next(new AppError("All required fields must be provided",400));
        }

        const {
            cashbookAndOtherAccounts,
            creditorsAndDebitorsList,
            bankStatements,
            gstStatement,
            stockDetails,
        }=req.files

        if(!cashbookAndOtherAccounts || !creditorsAndDebitorsList || !bankStatements || !gstStatement || !stockDetails){
            return next(new AppError("All required files must be provided",400));
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
            return next(new AppError("Franchise should be logged in", 401))
        }
        const Data = await Franchise.findOne({ where: { email: user.email } });
        const uniqueId = Data.franchiseUniqueId

        const hashedGstPassword= await bcrypt.hash(gstPassword,8)
    
        const newFinancialStatement=await financialstatements.create({
            uniqueId,
            customerName,
            businessName,
            businessType,
            mobileNumber,
            email,
            gstUsername,
            gstPassword:hashedGstPassword,
            cashbookAndOtherAccounts:await uploadFile(req.files.cashbookAndOtherAccounts),
            creditorsAndDebitorsList:await uploadFile(req.files.creditorsAndDebitorsList),
            bankStatements:await uploadFile(req.files.bankStatements),
            gstStatement:await uploadFile(req.files.gstStatement),
            stockDetails:await uploadFile(req.files.stockDetails),
        })

        if(!newFinancialStatement){
            return next(new AppError(" financial statements failed"));
        }

        console.log(newFinancialStatement)
        res.status(201).json({status: 'success', data: newFinancialStatement})

    } catch (error) {
        console.error("Error in financial statement:", error);
        res.status(500).json({ error: "Failed to create financial statement" });
    }
})

module.exports={
    financialStatement
}