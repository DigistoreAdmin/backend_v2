const { default: axios } = require("axios");
const Franchise = require("../../db/models/franchise");
const catchAsync = require("../../utils/catchAsync");
const wallets = require("../../db/models/wallet");


const fetchBill= catchAsync(async(req,res)=>{
    const {operatorId,phoneNumber,mobile,bbpsId} = req.body
    const user = req.user
    const Data = await Franchise.findOne({where:{email:user.email}})

    const randomDigit= fourDigitRandomNumberWithAlphabet()
    const urid=`${Data.franchiseUniqueId}${randomDigit}`

    //fbGl2ysaq1FTbJPEj4csnRrZIrWEol
    const response= await axios.post(`https://api.clubapi.in/utility/balance.php&token=fbGl2ysaq1FTbJPEj4csnRrZIrWEol&mobile=${mobile}$bbpsId=${bbpsId}&trancType=billFetch&urid=${urid}&opvalue1=&opvalue2=&opvalue3=&opvalue4=&opvalue5=&phoneNumber=${phoneNumber}`)

    res.status(200).json(response.data)
})

const billPayment=catchAsync(async(req,res)=>{
    const {amount,bbpsId,phoneNumber,mobile}=req.body
    const user=req.user

    const Data=await Franchise.findOne({where:{email:user.email}})
     const randomDigit= fourDigitRandomNumberWithAlphabet()
    const urid=`${Data.franchiseUniqueId}${randomDigit}`

    const walletData= await wallets.findOne({where:{uniqueId:Data.franchiseUniqueId}})
   
})


function randomAlphabet() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

function fourDigitRandomNumberWithAlphabet() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    const randomChar = randomAlphabet(); // Generates a random alphabet
    return randomChar + randomNumber.toString();
  }

module.exports ={fetchBill,billPayment}