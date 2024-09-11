
module.exports = {
  up: async(queryInterface, Sequelize) => {
    'prepaid', 'postpaid', 'Dth', 'Electricity', 'Water', 'Fastag', 'Landline'
      return queryInterface.bulkInsert('operators', [
            {
              serviceProvider:"Airtel Prepaid",
              SP_key:"3",
              commission:1.20,
              createdAt: new Date(),
              updatedAt: new Date(),
              rechargeType:"prepaid",
              commissionType:"percentage"
            },
            {
              serviceProvider:"Bsnl Prepaid",
              SP_key:"5",
              commission:4.00,
              createdAt: new Date(),
              updatedAt: new Date(),
              rechargeType:"prepaid",
              commissionType:"percentage"
            },
            // {
            //   serviceProvider:"Idea Prepaid",
            //   SP_key:"12",
            //   commission:4.00,
            //   createdAt: new Date(),
            //   updatedAt: new Date(),
            //   rechargeType:"prepaid",
            //   commissionType:"percentage"
            // },
            {
              serviceProvider:"Jio Prepaid",
              SP_key:"116",
              commission:0.50,
              createdAt: new Date(),
              updatedAt: new Date(),
              rechargeType:"prepaid",
              commissionType:"percentage"
            },
            {
              serviceProvider:"Vi Prepaid",
              SP_key:"37",
              commission:4.00,
              createdAt: new Date(),
              updatedAt: new Date(),
              rechargeType:"prepaid",
              commissionType:"percentage"
            },
          {
            serviceProvider:"Airtel Postpaid",
            SP_key:"PAF",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"postpaid",
            commissionType:"flat"
          },
          {
            serviceProvider:"Bsnl Postpaid",
            SP_key:"PBF",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"postpaid",
            commissionType:"flat"
          },
          {
            serviceProvider:"Jio Postpaid",
            SP_key:"PJF",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"postpaid",
            commissionType:"flat"
          },
          {
            serviceProvider:"Vi Postpaid",
            SP_key:"PVIF",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"postpaid",
            commissionType:"flat"
          },
          {
            serviceProvider:"Airtel Digital Tv",
            SP_key:"DA",
            commission:4.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Dth",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Dish Tv",
            SP_key:"DD",
            commission:4.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Dth",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Sun Direct",
            SP_key:"DS",
            commission:3.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Dth",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Tata Sky",
            SP_key:"DT",
            commission:3.50,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Dth",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Videocon D2h",
            SP_key:"DV",
            commission:4.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Dth",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Airtel Landline",
            SP_key:"LA",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Landline",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Bsnl - Corporate",
            SP_key:"LBC",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Landline",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Bsnl - Individual",
            SP_key:"LB",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Landline",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Kerala State Electricity Board Ltd. (KSEB)",
            SP_key:"319",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Electricity",
            commissionType:"flat"
          },
          
          {
            serviceProvider:"Airtel Payments Bank NETC FASTag",
            SP_key:"3819",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"AU Bank Fastag",
            SP_key:"3827",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Axis Bank Fastag",
            SP_key:"3805",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Bandhan Bank Fastag",
            SP_key:"3828",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Bank Of Baroda - Fastag",
            SP_key:"3804",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Bank of Maharashtra FASTag",
            SP_key:"3811",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Canara Bank Fastag",
            SP_key:"3829",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Federal Bank - Fastag",
            SP_key:"3813",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"HDFC Bank - Fastag",
            SP_key:"3807",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"ICICI Bank Fastag",
            SP_key:"3801",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"IDBI Bank Fastag",
            SP_key:"3816",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"IDFC First Bank- Fastag",
            SP_key:"3806",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Indian Bank Fastag Recharge",
            SP_key:"3830",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Indian Highways Management Company Ltd Fastag",
            SP_key:"3803",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Karnataka Bank Fastag",
            SP_key:"3820",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Kotak Mahindra Bank - Fastag",
            SP_key:"3809",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"LivQuik Technology India Private Limited",
            SP_key:"3831",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Paytm Payments Bank Fastag",
            SP_key:"3812",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Saraswat Bank - FASTag",
            SP_key:"3824",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"South Indian Bank Fastag",
            SP_key:"3825",
            commission:0.20,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Fastag",
            commissionType:"percentage"
          },
          {
            serviceProvider:"Kerala Water Authority (KWA)",
            SP_key:"677",
            commission:1.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            rechargeType:"Water",
            commissionType:"flat"
          },
      ]);
  },
  down: async(queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('operators',  null , {});
  },
};
