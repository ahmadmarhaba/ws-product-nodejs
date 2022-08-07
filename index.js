require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const redis = require('./redis');
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
  host: process.env.PGHOST,// <ignore scan-env>
  user: process.env.PGUSER,// <ignore scan-env>
  database : process.env.PGDATABASE,// <ignore scan-env>
  password : process.env.PGPASSWORD,// <ignore scan-env>
  port : process.env.PGPORT,// <ignore scan-env>
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
  // allowExitOnIdle : true
})

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

const queryHandler = async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const requests = await redis.incr(ip);
  console.log(`Number of requests made so far ${requests}`);
  if (requests === 1) {
    console.log(1)
    await redis.expire(ip, 60);
    console.log(2)
  }
  if (requests > 25) {
    res.status(503)
      .json({
        response: 'Error',
        callsMade: requests,
        msg: 'Too many calls made'
      });
      console.log(3)
  } else{
    pool.query(req.sqlQuery).then((r) => {
      console.log(4)
      return res.json(r.rows || [])
    }).catch(next)
  }  
}

app.get('/', (req, res) => {
  res.send("Server works"); 
})

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {// <ignore scan-env>
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)// <ignore scan-env>
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})


