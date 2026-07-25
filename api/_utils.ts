export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

export async function parseRequestBody(req: any): Promise<any> {
  try {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        try {
          return JSON.parse(req.body);
        } catch {
          return req.body;
        }
      }
      return req.body;
    }

    if (req.readableEnded || req.complete) {
      return {};
    }

    return await new Promise((resolve) => {
      let bodyText = '';
      const onData = (chunk: any) => {
        bodyText += chunk;
      };
      const onEnd = () => {
        cleanup();
        if (!bodyText) return resolve({});
        try {
          resolve(JSON.parse(bodyText));
        } catch {
          resolve(bodyText);
        }
      };
      const onError = () => {
        cleanup();
        resolve({});
      };
      const cleanup = () => {
        if (typeof req.off === 'function') {
          req.off('data', onData);
          req.off('end', onEnd);
          req.off('error', onError);
        }
      };

      req.on('data', onData);
      req.on('end', onEnd);
      req.on('error', onError);

      // Safety 1-second timeout so stream parsing never hangs on Vercel
      setTimeout(() => {
        cleanup();
        resolve({});
      }, 1000);
    });
  } catch {
    return {};
  }
}
