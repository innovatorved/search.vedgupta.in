# Search

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

```
https://search.vedgupta.in?q=%s
```

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

The original project solves this by doing all of the work client side. Once you've visited https://undick.link once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not the server.

## Credits

This project is a fork of [Unduck](https://github.com/t3dotgg/unduck) by [Theo](https://github.com/t3dotgg), modified for personal use. The original project is excellent and this is just adapted for my needs.

I appreciate the original project Unduck - this is an altered version specific for my needs. Thanks [@theo](https://github.com/t3dotgg)!
