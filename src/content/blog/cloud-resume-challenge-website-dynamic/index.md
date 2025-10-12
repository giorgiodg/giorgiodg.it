---
title: "My journey into the Cloud Resume Challenge: making the website dynamic"
description: "The second post in my Cloud Resume Challenge series. This time, adding a dynamic view counter using AWS Lambda, DynamoDB, JavaScript, and Terraform."
date: "Oct 10 2025"
tags: ["AWS", "cloud", "cloud resume challenge", "DevOps", "JavaScript"]
draft: false
---

In the [first post](/blog/cloud-resume-challenge-aws-foundation) of the series, we laid the foundations using **AWS**, **Astro**, **S3**, and **CloudFront**.  
Now it’s time to make the website more dynamic by adding a view counter powered by **Lambda** and **DynamoDB**.

### 4. Setup a view counter through Lambda, DynamoDB, and JavaScript

#### Setup DynamoDB

We’ll start by creating a **DynamoDB** table that will store the number of visits.  
In the AWS Console, open **DynamoDB → Tables → Create table**, and set `id` as the **Partition key**.  
Tag it with the usual pair `(project, Cloud Resume Challenge)`.

Once it becomes **Active**, open **Explore table items** and create an item with:

- `id`: `"1"` (string)
- `views`: `1` (number)

#### Create a Lambda function

Let's create a **Lambda** function to interact with the DynamoDB table and increment the view count.  
Go to **AWS Lambda → Create function**, specify a name, and choose your preferred runtime.  
I chose **Node.js 22.x** because of my JavaScript background.  
Tag the Lambda with the usual pair `(project, Cloud Resume Challenge)`.
In the **Advanced settings**, enable **Function URL** to allow interaction through HTTP requests, and set the **Auth type** to **NONE** to permit unrestricted access.  
Enable **CORS** and allowlist your website URL as the only allowed origin.  
If you plan to test from a browser or `curl`, you may **temporarily** leave it set to `"*"`.

Now configure the right permissions:  
Go to **Configuration → Permissions**, click the hyperlink under **Execution role**, and attach the **AmazonDynamoDBFullAccess** policy.

#### Create the Lambda JavaScript logic

We'll need to create a logic to:

1. Retrieve the current value of the `views` attribute from the table
2. Increment the retrieved value by 1
3. Update the table with the new `views` value
4. Return the updated value as the output of the Lambda

Here's the snippet you can deploy to fulfill this:

```js
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "YOUR AWS REGION" });
const TABLE_NAME = "YOUR DYNAMODB TABLE";

export const handler = async (event) => {
  try {
    const getCommand = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: "1" },
      },
    });

    const getResponse = await client.send(getCommand);

    if (!getResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Item not found" }),
      };
    }

    const updateCommand = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: "1" },
      },
      UpdateExpression: "SET #v = if_not_exists(#v, :start) + :inc",
      ExpressionAttributeNames: {
        "#v": "views",
      },
      ExpressionAttributeValues: {
        ":inc": { N: "1" },
        ":start": { N: "0" },
      },
      ReturnValues: "ALL_NEW",
    });

    const updateResponse = await client.send(updateCommand);
    const updatedItem = unmarshall(updateResponse.Attributes);

    return {
      statusCode: 200,
      body: JSON.stringify({ views: updatedItem.views }),
    };
  } catch (err) {
    console.error("Error fetching/updating item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
```

You can either use a `curl` or a browser to invoke the Lambda and check if
the view counter has been increased.

#### Create the website JavaScript logic

This JavaScript snippet fetches the view count data from the Lambda and
updates the content of the `#views` HTML element. This is executed once
the page loads.

```js
const views = document.querySelector("#views") as HTMLElement | null;

async function updateCounter() {
  if (!views) {
    console.error("Element not found");
    return;
  }
  try {
    const response = await fetch("YOUR_LAMBDA_URL");
    const data = await response.json();
    views.innerHTML = `Views: ${data.views}`;
  } catch (error) {
    console.error("Error updating view counter", error);
  }
}

updateCounter();
```

It's up to you whether to include this script inline within your TML or as a separate .js file referenced in your page.
Just make sure the script runs after the #views element has been loaded.

Now that you've successfully tested the client-server interaction, go back to the **CORS** settings of your Lambda and replace `*` with your website URL to avoid unexpected calls.

### 5. Terraform (IaC)

At this point, I realized it was time to use Infrastructure as Code (IaC) to reproduce all the manual configuration I had performed so far.
This part took the longest, as I had to learn Terraform fundamentals to port everything I had built manually.
On the flip side, it drastically reduced manual toil and made testing much faster.
You can check the final implementation in my <a href="https://github.com/giorgiodg/aws-cloud-resume-challenge/tree/main/terraform" target="_blank">terraform folder</a> on GitHub.

In the next post, I'll focus on automating deployments with **GitHub Actions** to bring everything together into a continuous delivery flow.
