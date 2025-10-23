---
title: "My journey into the Cloud Resume Challenge: building the foundation on AWS"
description: "This is the first post in a series about the Cloud Resume Challenge. Learn how to complete the initial steps using AWS, Astro, S3, and CloudFront to build and host your cloud personal website."
date: "Oct 08 2025"
tags: ["AWS", "cloud", "cloud resume challenge", "DevOps"]
draft: false
---

The job market is more demanding these days. And when it comes to finding a job in tech, it’s no longer enough to showcase your skills on your CV. Recruiters will look not only at your LinkedIn, but also at your GitHub and personal website.

Where once a Senior Engineering Manager didn’t need to demonstrate day-to-day hands-on experience, now it has become almost a must-have.

So, I needed something that could give me more exposure to the hands-on topics essential to DevOps, Cloud, and Platform Engineering. **The Cloud Resume Challenge** is perfect for testing those skills.

The challenge is officially made up of **16 steps**, and there are **three versions**. One for each of the most popular cloud providers: AWS, Azure, and GCP. If you want to learn more about the challenge and explore other success stories, be sure to visit <a href="https://cloudresumechallenge.dev/" target="_blank">the official website</a>.

This is the first post in a collection I’m writing to share what I’ve learned to build a cloud resume on **AWS**.

### 1. HTML website

As with this [website](/blog/welcome-to-my-new-website), I chose **Astro** because it’s a lightweight and fast framework. After trying more complex options like GatsbyJS and Next.js, I appreciated its shallow learning curve and how quickly I could get a working product online.

### 2. CloudFront and S3

#### Create an S3 bucket

In the **S3 console**, click **Create bucket**.  
Choose your preferred region and give the bucket a unique name.  
Make sure to:

- Keep **ACLs disabled**
- **Block all public access**
- Optionally **enable versioning**
- Disable **Static website hosting** because CloudFront will handle content delivery

Lastly, tag the bucket with the key-value pair `(project, Cloud Resume Challenge)`.

#### Setup CloudFront

**CloudFront** works through _distributions_, so create a new one by selecting **Single website or app**.  
Choose **Amazon S3** as the origin and select the bucket hosting your website. Leave the **Origin path** empty unless your `index.html` is not in the root folder.

After selecting **Do not enable security protections**, click **Create distribution**.  
It may take a few minutes to deploy. While it’s being created, update a couple of settings:

- In **General**, set **Default root object** to `index.html`
- In **Behaviors**, set **Viewer protocol policy** to **Redirect HTTP to HTTPS**

This ensures your site serves the correct file and forces secure connections.

#### Fix subfolder access

If your website is made up of subfolders that turn into URLs like `/about/`, `/blog/`, etc., you may come across an **Access Denied** error.  
Since we’re not using the S3 static website endpoint, they will not be identified as valid objects.  
This can be solved by implementing a simple **CloudFront Function** that appends `index.html` where necessary:

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

#### Buy a domain

I used GoDaddy to buy <a href="https://www.giorgiodg.cloud" target="_blank">giorgiodg.cloud</a> at a very cheap price. In retrospect, I may have used another service because of reasons you will discover soon.

#### Create a new certificate

Go to **Certificate Manager (ACM)** and request a certificate. Just make sure you're in the **us-east-1 (N. Virginia)** region.  
Use an asterisk to request a wildcard certificate to protect several sites in the same domain — in my case, it was `*.giorgiodg.cloud`.  
Leave the default settings, and tag it as usual. The newly created certificate will show as **Pending validation**.

Now, head over to **GoDaddy** and go to **My Products → DNS → Manage DNS**.  
Here, you'll add two **CNAME records**:

- The first will point to your **CloudFront** distribution:
  - Type: `CNAME`
  - Name: `www`
  - Value: **your CloudFront distribution name**

  **Note:** if there’s already a record for `www`, edit its value instead of creating a new one — otherwise, you might get an error.

- The second will point to the **AWS Certificate Manager (ACM)** validation server:
  - Type: `CNAME`
  - Name: **use the CNAME name in the ACM certificate**
  - Value: **use the CNAME value in the ACM certificate**

  **Note:** if the CNAME name is `_c3e2d7eaf1e656b73f46cd6980fdc0e.example.com`, enter only `_c3e2d7eaf1e656b73f46cd6980fdc0e`.

Once the certificate status changes to **Issued**, head over to the **CloudFront console**.  
Select your distribution, and in the **General** section:

- Add your domain name under **Alternate domain name (CNAME)**
- Select the new certificate under **Custom SSL certificate**
- Save your changes and wait for deployment to complete

#### Note about GoDaddy

GoDaddy doesn’t support CNAME records for **APEX (root)** domains by default. Luckily, there's a workaround.  
In my case, I went to the **Forwarding** section in GoDaddy and added this rule:

- Domain: `giorgiodg.cloud`
- Destination: `https://www.giorgiodg.cloud`
- Type: **Permanent (301)** redirect

That’s why I said earlier that I might have preferred using **Route 53**.

With the domain and SSL in place, the foundation was ready.  
It was exciting to navigate to <a href="https://www.giorgiodg.cloud" target="_blank">giorgiodg.cloud</a> and see the website live!  
In the [next post](/blog/cloud-resume-challenge-website-dynamic), I’ll continue with backend integration to make the website dynamic.
