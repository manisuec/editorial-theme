---
title: "HTTP Headers: Complete Guide to Secure & Optimize Your APIs"
date: 2026-01-20
draft: false
categories: ["Node.js"]
tags: ["nodejs", "security", "http", "api"]
author: "Manish Prasad"
featuredTitle: "Node.js Security Done Right"
featuredDescription: "Production lessons from someone who's learned the hard way. Real vulnerabilities, real solutions."
---

Running a production API without properly configured HTTP headers is leaving your front door unlocked. Browsers block modern features, CDNs refuse to cache your responses and attackers can exploit XSS, clickjacking and CSRF vulnerabilities in seconds.

<!--more-->

## Introduction

In this comprehensive guide, we'll cover everything you need to know about HTTP headers for securing and optimizing your Node.js/Express APIs.

## Security Headers

### Content Security Policy

Content Security Policy (CSP) is one of the most powerful security headers available:

```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );
  next();
});
```

### X-Frame-Options

Prevent clickjacking attacks:

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
```

## Performance Headers

### Cache Control

Optimize caching for better performance:

```javascript
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});
```

## Best Practices

1. Always use HTTPS in production
2. Set security headers on all responses
3. Test headers with security scanners
4. Keep headers updated with latest recommendations

## Conclusion

Properly configured HTTP headers are essential for both security and performance. Take the time to implement them correctly in your applications.
