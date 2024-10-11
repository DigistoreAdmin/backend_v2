const Redis = require('ioredis');
const redis = new Redis();

const rateLimiting =async(req,res,next)=>{
    const limit = 5; 
    const timeWindow = 60; 

    const phoneNumber = req.body.phoneNumber; 
    const key = phoneNumber;
  
    redis.get(key, (err, record) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      const currentRequests = record ? parseInt(record) : 0;
  
      if (currentRequests >= limit) {
        return res.status(429).json({ error: 'Too many requests, please try again later.' });
      }
  
      redis.multi()
        .incr(key) 
        .expire(key, timeWindow) 
        .exec((err) => {
          if (err) {
            console.error('Redis error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          next();
        });
    });
  };


module.exports={
    rateLimiting
}