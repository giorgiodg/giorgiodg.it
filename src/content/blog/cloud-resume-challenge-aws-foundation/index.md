---
title: "My journey into the Cloud Resume Challenge: building the Foundation on AWS"
description: "This is the first post in a series about the Cloud Resume Challenge. Learn how to complete the initial steps using AWS, Astro, S3, and CloudFront to build and host your cloud personal website."
date: "Oct 10 2025"
tags: ["AWS", "cloud", "cloud resume challenge"]
draft: true
---

The job market is more demanding these days. And when it comes to finding a job in tech, it’s no longer enough to showcase your skills on your CV. Recruiters will look not only at your LinkedIn, but also at your GitHub and personal website.

Where once a Senior Engineering Manager didn’t need to demonstrate day-to-day hands-on experience, now it has become almost a must-have.

So, I needed something that could give me more exposure to the hands-on topics essential to DevOps, Cloud, and Platform Engineering. **The Cloud Resume Challenge** is perfect for testing those skills.

The challenge is officially made up of **16 steps**, and there are **three versions**. One for each of the most popular cloud providers: AWS, Azure, and GCP. If you want to learn more about the challenge and explore other success stories, be sure to visit [the official website](https://cloudresumechallenge.dev/).

This is the first post in a collection I’m writing to share what I’ve learned to build a cloud resume on AWS.

### 1. HTML website

Like in the case of this [website](/welcome-to-my-new-website) I chose [**Astro**](https://astro.build/) because it’s a lightweight and fast framework. After trying more complex options like GatsbyJS and Next.js, I appreciated its shallow learning curve and how quickly I could get a working product online.

### 2. CloudFront and S3

#### Create a S3 bucket

Create a new bucket in your preferred region and give it a unique name.
Make sure to:

- Keep ACLs disabled
- Block all public access
- Optionally enable versioning
- Disable “Static website hosting” because CloudFront will take care of content delivery

Lastly, I suggest tagging the bucket with the key-value pair `(project, Cloud Resume Challenge)`.

#### Setup CloudFront

CloudFront works through _distributions_, so create a new one by selecting “Single website or app.”
Choose Amazon S3 as the origin, and browse through your S3 buckets to select the one hosting your website. Leave the origin path empty unless your `index.html` is **not** in the root folder.
After selecting “Do not enable security protections”, create the distribution. It may take a few minutes to deploy. While it’s being created, update a couple of settings:

- In General, set the default root object to `index.html`
- In Behaviors, set Viewer protocol policy to Redirect HTTP to HTTPS

This ensures your site serves the correct file and forces secure connections.

#### Fix subfolder access

If your website is made up of subfolders that turn into URLs like `/about/`, `/blog/` etc, you may come across an **Access Denied** error. Since we're not using the S3 static website endpoint, they will not be identified as valid objects. We can solve this by implementing a simple CloudFront function that appends index.html where necessary.

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri += "index.html";
  } else if (!uri.includes(".")) {
    request.uri += "/index.html";
  }

  return request;
}
```
