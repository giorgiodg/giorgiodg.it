---
title: "My journey into the Cloud Resume Challenge: building the Foundation on AWS"
description: "This is the first post in a series about the Cloud Resume Challenge. Learn how to complete the initial steps using AWS, Astro, S3, and CloudFront to build and host your cloud personal website."
date: "Oct 08 2025"
tags: ["AWS", "cloud", "cloud resume challenge", "DevOps"]
draft: false
---

The job market is more demanding these days. And when it comes to finding a job in tech, it’s no longer enough to showcase your skills on your CV. Recruiters will look not only at your LinkedIn, but also at your GitHub and personal website.

Where once a Senior Engineering Manager didn’t need to demonstrate day-to-day hands-on experience, now it has become almost a must-have.

So, I needed something that could give me more exposure to the hands-on topics essential to DevOps, Cloud, and Platform Engineering. **The Cloud Resume Challenge** is perfect for testing those skills.

The challenge is officially made up of **16 steps**, and there are **three versions**. One for each of the most popular cloud providers: AWS, Azure, and GCP. If you want to learn more about the challenge and explore other success stories, be sure to visit [the official website](https://cloudresumechallenge.dev/).

This is the first post in a collection I’m writing to share what I’ve learned to build a cloud resume on AWS.

### 1. HTML website

As with this [website](/blog/welcome-to-my-new-website) I chose [**Astro**](https://astro.build/) because it’s a lightweight and fast framework. After trying more complex options like GatsbyJS and Next.js, I appreciated its shallow learning curve and how quickly I could get a working product online.

### 2. CloudFront and S3

#### Create an S3 bucket

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

### 3. Domain and SSL integration with CloudFront

### Buy a domain

I used GoDaddy to buy <a href="https://www.giorgiodg.cloud" target="_blank">giorgiodg.cloud</a> at a very cheap price. In retrospect I may have used another service, probably Route53 because of reasons you will discover soon.

### Create a new certificate

Go to Certificate Manager (ACM) and request a certificate. Just make sure you're in the us-east-1 (N. Virginia) region.
Use an asterisk to request a wildcard certificate to protect several sites in the same domain. In my case it was `*.giorgiodg.cloud`.
Leave the default settings, and add tagging as usual. The newly created certificate will be in "Pending validation".

So, let's navigate to GoDaddy, go to My Products > DNS > Manage DNS.
Here we'll add two CNAME Records:

- The first will point to your CloudFront distribution:
  - Type: CNAME
  - Name: www
  - Value: **your cloudfront distribution name**

**Note:** that if there is already a "www" value, then you can edit the value. Creating a new one could give you an error message.

- The second will point to the AWS Certificate Manager (ACM) validation server:
  - Type: CNAME
  - Name: **use the CNAME name in the ACM certificate**
  - Value: **use the CNAME value in the ACM certificate**

**Note:** if the CNAME name is **\_c3e2d7eaf1e656b73f46cd6980fdc0e.example.com**, enter only **\_c3e2d7eaf1e656b73f46cd6980fdc0e**

Once the certificate status changes to "issued" head over to the CloudFront console.
Select your CloudFront distribution
In the "General" section of your CloudFront distribution add the domain name you entered for your certificate in the "Alternate domain name (CNAME)" section.
Select the certificate you just generated in the "Custom SSL certificate" section, save and wait for the deployment.

### Note about GoDaddy

GoDaddy doesn’t support CNAME records for APEX (root) domains by default. Luckily, there's a workaround.
In my case I had to go to the Forwarding section on GoDaddy and add this rule:

- Domain giorgiodg.cloud
- Destination https://www.giorgiodg.cloud
- Choose the Permanent (301) forward option
  This is why I said earlier that I shouldn't have bought a GoDaddy domain.

With the domain and SSL in place, the foundation is ready. It was exciting to navigate to <a href="https://www.giorgiodg.cloud" target="_blank">giorgiodg.cloud</a> and see the website live!  
In the next post, I’ll continue with backend integration to make the website dynamic.
