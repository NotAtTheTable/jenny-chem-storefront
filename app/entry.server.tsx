import type { EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {

  const ABORT_DELAY = 5_000;

  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    styleSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    imgSrc: [
      "'self'",
      'https://placehold.co',
      'https://cdn.shopify.com',
    ],
    scriptSrc: [
      "'self'",
      'http://widget.trustpilot.com',
      'https://www.youtube.com',
      'https://player.vimeo.com',
      'https://cdn.shopify.com',
      'https://www.youtube-nocookie.com',
    ],
    frameSrc: [
      "'self'",
      'https://widget.trustpilot.com',
      'https://www.youtube.com',
      'https://player.vimeo.com',
      'https://cdn.shopify.com',
      'https://www.youtube-nocookie.com',
    ]
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
