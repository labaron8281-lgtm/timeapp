// Add to your existing Express server.js AFTER app.use(express.json()) and BEFORE app.listen().
// Requires APP_LOGIN_PASSWORD to be configured in Render environment variables.
// Do NOT put the real password in this file, your EXE or the Git repository.
const desktopCrypto = require('node:crypto');
const desktopFailures = new Map();
app.post('/api/desktop-login', (req, res) => {
  res.set('Cache-Control','no-store');
  const remote = req.ip || req.socket.remoteAddress || 'unknown';
  const previous = desktopFailures.get(remote) || {count:0,until:0};
  if (Date.now() < previous.until) return res.status(429).json({ok:false,error:'Too many attempts. Try later.'});
  const expected = process.env.APP_LOGIN_PASSWORD;
  if (!expected) return res.status(503).json({ok:false,error:'APP_LOGIN_PASSWORD not configured on server.'});
  const submitted = typeof req.body?.password === 'string' ? req.body.password : '';
  const a = Buffer.from(submitted, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  const match = a.length === b.length && desktopCrypto.timingSafeEqual(a,b);
  if(!match) {
    const count=previous.count+1;
    desktopFailures.set(remote,{count,until:count>=5?Date.now()+15*60*1000:0});
    return res.status(401).json({ok:false,error:'Incorrect password.'});
  }
  desktopFailures.delete(remote);
  return res.json({ok:true,token:desktopCrypto.randomBytes(32).toString('hex'),expiresInSeconds:3600});
});
