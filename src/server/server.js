/* eslint no-console: 0 */
import express from 'express';

import webpackMiddleware from 'server/middleware/webpack';
import distMiddleware    from 'server/middleware/dist';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port         = process.env.PORT || 3000;

const app = express();

if (isDeveloping) {
  webpackMiddleware(app);
}
else {
  distMiddleware(app);
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
