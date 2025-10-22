---
title: "My journey into the Cloud Resume Challenge: Automating Frontend Deployment with CI/CD"
description: "In the third post of the Cloud Resume Challenge series, I automate frontend deployment using GitHub Actions, configure AWS IAM for deployment, and run E2E tests with Cypress."
date: "Oct 22 2025"
tags: ["AWS", "cloud", "cloud resume challenge", "DevOps"]
draft: false
---

In the [second post](/blog/cloud-resume-challenge-website-dynamic), we made the website dynamic by adding a live view counter with **Lambda**, **DynamoDB**, and **JavaScript**.  
Now it’s time to remove manual deployments and automate the process using **CI/CD**.

### 6. CI/CD Pipeline

#### Version control setup

I created a new GitHub repository called [`aws-cloud-resume-challenge`](https://github.com/giorgiodg/aws-cloud-resume-challenge/) and organized it into three folders:

- `frontend/` (for the website)
- `backend/` (for the Lambda function)
- `terraform/`

A fourth folder `.github/workflows/` is used to store GitHub Actions workflows.

#### Frontend deployment workflow

We’re going to use **GitHub Actions** to trigger a website upload to S3 whenever there’s a code change.
Create a workflow file called `frontend-deploy.yml` in `.github/workflows/`:

```yml
name: Frontend - Deploy

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install modules
        run: npm ci
        working-directory: frontend

      - name: Build application
        run: npm run build
        working-directory: frontend

      - name: Deploy to S3
        run: aws s3 sync --delete ./dist/ s3://${{ secrets.AWS_BUCKET_ID }}
        working-directory: frontend

      - name: Create CloudFront invalidation
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/*"
```

This workflow:

- Builds the frontend
- Uploads it to the S3 bucket
- Invalidates the CloudFront cache so new changes are visible immediately

GitHub will provide the environment variables through its **Secrets** capability.
The values for the bucket and distribution ID are straightforward. Next, let’s configure the necessary IAM user to get Key ID and Access key.

#### Create an IAM User for GitHub Actions

To allow GitHub Actions to interact with AWS, I created an **IAM User** with a minimal following the **least privilege principle**.  
The user needs permissions to interact with the S3 bucket and invalidate CloudFront caches.

```json
{
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3Frontend"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetObject"
        ]
        Resource = [
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*"
        ]
      },
      {
        Sid    = "CloudFrontInvalidation"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations",
          "cloudfront:GetDistribution",
          "cloudfront:ListDistributions"
        ]
        Resource = "*"
      }
    ]
  }
```

The IAM user is created with **Terraform**, using the [ci_user module](https://github.com/giorgiodg/aws-cloud-resume-challenge/blob/main/terraform/modules/ci_user/main.tf).  
By default, Terraform does not print Key ID and Access key outputs. You can enable them like this:

```tf
output "github_actions_access_key_id" {
  value     = aws_iam_access_key.github.id
  sensitive = true
}

output "github_actions_secret_access_key" {
  value     = aws_iam_access_key.github.secret
  sensitive = true
}
```

Then run:

```bash
$ terraform plan
$ terraform apply
$ terraform output github_actions_access_key_id
$ terraform output github_actions_secret_access_key
```

and add the values to GitHub **Secrets**.

### 7. Frontend Testing with Cypress

I wanted to ensure the website still works before each deployment, so I added **end-to-end tests** with **Cypress**.

#### Configure Cypress

Install Cypress:

```bash
npm install cypress --save-dev
```

Create `cypress.config.js` under `frontend/`

```js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    baseUrl: "http://localhost:4321",
  },
});
```

Add a test file in `frontend/cypress/e2e/index.cy.js` to check title, view counter, blog list, and personal section.

```js
beforeEach(() => {
  cy.visit("/");
});

it("titles are correct", () => {
  cy.get("title").should(
    "have.text",
    "The Cloud Resume Challenge | giorgiodg.cloud"
  );
  cy.get("h1")
    .invoke("text")
    .then((text) => {
      expect(text.trim()).to.equal("The Cloud Resume Challenge");
    });
});

it("view counter is visualized", () => {
  cy.get("#views").should("have.text", "Views: N/A");
});

it("there's a blogpost section and contains a list with at least one item", () => {
  cy.get("section")
    .eq(1)
    .within(() => {
      cy.get("ul > li").its("length").should("be.gte", 1);

      cy.get("ul > li").each(($li) => {
        cy.wrap($li).find("a").should("have.attr", "href").and("not.be.empty");
      });
    });
});

it("there's a section with name and personal links", () => {
  cy.get("section")
    .eq(2)
    .within(() => {
      cy.get("h5")
        .invoke("text")
        .then((text) => {
          expect(text.trim()).to.equal("Giorgio Delle Grottaglie");
        });

      cy.get("button").its("length").should("be.gte", 1);
    });
});
```

Run tests locally to verify the setup:

```bash
npx cypress run
```

#### Frontend E2E tests workflow

Create `frontend-e2e-tests.yml` to run Cypress tests in GitHub Actions:

```yml
name: Frontend - E2E Tests

on:
  push:
    branches:
      - main
    paths:
      - "frontend/**"
  pull_request:
    paths:
      - "frontend/**"
  workflow_dispatch:

jobs:
  cypress-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install modules
        run: npm ci
        working-directory: frontend

      - name: Build application
        run: npm run build
        working-directory: frontend

      - name: Start preview server
        run: npm run preview &
        working-directory: frontend

      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          wait-on: http://localhost:4321
          working-directory: frontend
```

This workflow runs automatically when code in `frontend/` changes.
We can then make deployment dependent on these tests passing.

#### Deploy workflow dependency

Modify `frontend-deploy.yml` to trigger **only** after successful E2E tests:

```yml
name: Frontend - Deploy

on:
  workflow_run:
    workflows: ["Frontend - E2E Tests"]
    types:
      - completed

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.head_branch == 'main' }}
    runs-on: ubuntu-latest

[...]
```

### Next Steps

With this post, I automated frontend deployment and added end-to-end testing.
Future enhancements include:

- Infrastructure automated deployment
- Lambda automated deployment
- Lambda E2E testing
- API Gateway integration
- Making the Lambda URL dynamic on the frontend
- Tracking unique users

I’ll prioritize these improvements using the [MoSCoW method](https://en.wikipedia.org/wiki/MoSCoW_method) and implement the most important items based on the time available.
