---
title: "How to integrate Betterlytics in Astro"
description: "Learn how to integrate Betterlytics, a cookieless and open-source analytics tool, into your Astro site. Includes setup steps, environment variables, and custom event tracking with TypeScript."
date: "Oct 06 2025"
tags: ["astro", "development", "open source"]
draft: false
---

When I migrated this site from Next.js to [Astro](https://astro.build/), one of the first things I needed to re-enable was analytics.
I recently switched to [Betterlytics](https://betterlytics.io/) for that, an open-source, cookieless, and lightweight alternative to mainstream trackers.

Let’s walk through how to integrate it into an Astro project.

### Set up your environment variables

First, let’s set up two environment variables in the `.env` file.
These control whether the library is enabled and define the site ID you received from Betterlytics at signup.

```bash
PUBLIC_ENABLE_BETTERLYTICS=false
BETTERLYTICS_SITE_ID=XXXXXXXXX
```

### Create the Betterlytics component for Astro

Next, create a new component, ideally `src/components/BetterlyticsTracker.astro`, to manage the library loading as well as the custom event tracking.

```ts
---
interface Props {
  enable?: boolean;
  siteId: string;
}

const { enable = true, siteId } = Astro.props;
---

{
  enable && (
    <script
      async
      src="https://betterlytics.io/analytics.js"
      data-site-id={siteId}
      data-server-url="https://betterlytics.io/track"
    />
  )
}
```

Import this component where you need it (usually in your `BaseLayout.astro`) to ensure it applies globally:

```ts
import BetterlyticsTracker from "../components/BetterlyticsTracker.astro";

[...]

<BetterlyticsTracker
      enable={import.meta.env.PUBLIC_ENABLE_BETTERLYTICS === "true"}
      siteId={import.meta.env.BETTERLYTICS_SITE_ID}
/>
```

Note that this implementation will provide you page views out of the box.

### Track custom events

If you want to track something that goes beyond standard page views you can leverage **custom events tracking**.
In my case, I used this feature to track interactions with a few specific call-to-actions. To do this, we'll have to call `betterlytics.event();`

Let's go back to `src/components/BetterlyticsTracker.astro` and add a global type declaration for betterlytics in the frontmatter script.

```ts
---
interface Props {
  enable?: boolean;
  siteId: string;
}

// Add global type declaration for betterlytics
declare global {
  interface Window {
    betterlytics?: {
    event: (eventName: string, params?: Record<string, unknown>) => void;
    };
    trackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
  }
}

const { enable = true, siteId,  } = Astro.props;
---
```

Then, let's define another inline script to allow calling `betterlytics.event();`.

```ts
<script>
  function waitForBetterlytics() {
        return new Promise<void>(resolve => {
          const interval = setInterval(() => {
            if (window.betterlytics) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

  waitForBetterlytics().then(() => {
        window.trackEvent = (eventName, params = {}) => {
          if (window.betterlytics) {
            window.betterlytics.event(eventName, params);
          }
        };

        document.addEventListener("click", (e) => {

          const el = (e.target instanceof Element) ? e.target.closest("[data-event]") : null;
          if (!el) return;

          const event = (el as HTMLElement).dataset.event;
          const propertiesString = (el as HTMLElement).dataset.properties;
          let properties = {};

          if (propertiesString) {
            try {
              properties = JSON.parse(propertiesString);
            } catch {
              console.warn("Invalid JSON in data-properties:", propertiesString);
            }
          }

          if (typeof window.trackEvent === "function" && typeof event === "string") {
            window.trackEvent(event, properties);
          }
        });
      });

</script>
```

`waitForBetterlytics()` ensures that the Betterlytics library is ready before proceeding. Once the promise resolves, a new function, `window.trackEvent`, is defined. This function wraps `betterlytics.event();`.

An event listener is added to the document to handle all **click** events. This listener is designed to track user interactions with elements that have specific `data-*` attributes. The `data-event` attribute is retrieved as the event name.
The `data-properties` attribute, if present, is treated as a JSON string. The code attempts to parse it into an object.

The use of TypeScript interfaces and global declarations will avoid errors when running `astro check`.

To finalize the custom event tracking, we must define a `data-event` attribute and, optionally, a `data-property` within the HTML object to be tracked.
See the example below for more clarity:

```html
<a
  href="https://github.com/giorgiodg/"
  data-event="cta-click"
  data-properties='{"buttonText":"GitHub","source":"index"}'
  >GitHub profile</a
>
```

### Conclusion

Astro and Betterlytics work together pretty well, and this setup should help you integrate both quickly.
This guide focuses on the script-based integration, but an **npm package** version might follow in the future.

And if you end up using Betterlytics, consider contributing. I recently added the [italian translation](https://github.com/betterlytics/betterlytics/pull/453)!
