---
slug: what-is-pydantic-and-how-can-it-help-your-next-python-project
title: What is Pydantic and how can it help your next python project?
description: For anyone that has been either living under a programming rock or honestly has stuff to do outside of python development, you may not have heard about Pydantic.
author: Bryson Meiling
pubDate: 2024-10-06
mediumLink: https://medium.com/python-in-plain-english/what-is-pydantic-and-how-can-it-help-your-next-python-project-a2d1bc01c91b
keywords: ["Software Development", "Python" , "Software Engineering"]
image: ../images/what-is-pydantic-and-how-can-it-help-your-next-python-project.webp
---
![Spidy knows a good validation library will help protect your local neighborhood](../images/what-is-pydantic-and-how-can-it-help-your-next-python-project.webp)

Of course. Here is the text formatted in markdown.

For anyone that has been either living under a programming rock or honestly has stuff to do outside of python development, you may not have heard about **Pydantic**. It's a package for data validation, object serialization and de-serialization, and class management.

In my recent article, *Stop using Python like it was 15 years ago*, I mentioned you should be using Pydantic models. So now I’m going to show you what I mean. Also, just found out a little while ago that the definition of *pedantic* is:

> “someone who annoys others by correcting small errors, caring too much about minor details, or emphasizing their own expertise especially in some narrow or boring subject matter.”

So this is very fitting for a medium tech article! haha


## What do I use it for?

* Parsing incoming **data**
* Passing around **settings**, **data**, and other information over **args**
* Ensuring that **types** are what I expect at runtime.

***

## 1. Parsing Incoming Data

Something I have done a few times is make a lambda function in python that does some kind of data pipeline or transformation. A lambda function will get an incoming payload of data (usually from API Gateway or SQS) and then process it. ([Link to AWS Docs](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-tutorial.html#services-apigateway-tutorial-function))

Let's say you are making a PayPal transaction processing lambda function behind an API Gateway. You need to parse the incoming request, call Paypal `POST /order` to create a new order, then return back the order ID to the frontend so that the client can accept the transaction.

The **brittle** way to do this is:

```python
def handler(event, context):
  if event and "user_id" in event and "db_order" in event:
    create_order(event.user_id, event.db_order, event)

  else:
    return "bad request"
```

It's brittle because you are not **validating** that `user_id` and `db_order` are UUID or the form you are expecting. This is a simple example, but if you are trying to parse in many args from the event, it's easy to mess it up. Also it sucks to read.

Try this: define a Pydantic model, then pass the dict into it. If it passes, then you continue. If it fails, then you assume it's a bad request.

```python
from uuid import UUID
from pydantic import BaseModel, ValidationError

class CreateOrderRequest(BaseModel):
  user_id = UUID
  db_order = UUID
  discount_code = str | None

def handler(event, context) -> str:
  try:
    request = CreateOrderRequest(**event)
    create_order(request)
  except ValidationError:
    logger.exception(f"Failed to parse event: {event}")
    return "Bad request"
```

It's much more **clear** about **what data you are expecting**, **what is optional**, and also the Pydantic library will check the **types of these parameters** automatically!

***

## 2. Passing around settings, data, and other information over args

I like this one because my future self appreciates the reduced maintenance. Why? Because coming back to code that is 6 months or older is tricky because you forgot **why you did certain things**. You forget the **assumptions** the code is making. So make it explicit!

Let's assume we are making an image processing pipeline. The code is going to download a requested image (from AWS S3), do a magic AI transformation on it, then save it back in another location.

Here is the **brittle way**:

```python
def image_pipeline(object_key: str):
    default_d_bucket = os.environ["download_bucket"]
    default_u_bucket = os.environ["upload_bucket"]
    # might cause index error

    path = download_image(object_key, default_d_bucket)
    do_ai_magic_transform(path)
    upload_image(object_key, path, default_u_bucket)

def download_image(object_key: str, bucket: str):
    boto3.client('s3').download_file(bucket, object_key, f"/tmp/{object_key}")
    return f"/tmp/{object_key}"

def do_ai_magic_transform(path: str):
    # Placeholder for AI transformation
    pass

def upload_image(object_key: str, path: str, bucket: str):
    if os.environ.get("is_special_object"):
        bucket = "special_bucket_name"
    else:
        logger.info("uploading to default location")

    with open(path, "rb") as file:
        boto3.client('s3').put_object(Bucket=bucket, Key=object_key, Body=file)

if __name__ == "__main__":
    image_pipeline("example.jpg")
```

This is only 3 small functions but it takes a few moments to understand what is going on, what environment variables are needed, why do we need a special upload bucket for special occasions, etc.

Now all information is centralized and you can more **easily understand the variants in this pipeline**. Also, the model type checks the information so you are not accidentally passing around a `None` at runtime.

```python
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class Config(BaseModel):
    object_key: str
    download_bucket: str = Field(..., env="download_bucket")
    upload_bucket: str = Field(..., env="upload_bucket")
    temp_dir: str = Field(default="/tmp")
    is_special_object: bool = Field(default=False, env="is_special_object")
    special_bucket_name: str = Field(default="special_bucket_name")
    path: str | None= None

def init_config(object_key: str) -> Config:
    config = Config(object_key=object_key)
    config.path = os.path.join(config.temp_dir, config.object_key)
    return config

def image_pipeline(config: Config):
    download_image(config)
    do_ai_magic_transform(config)
    upload_image(config)

def download_image(config: Config):
    boto3.client('s3').download_file(config.download_bucket, config.object_key, config.path)

def do_ai_magic_transform(config: Config):
    # Placeholder for AI transformation
    logger.info(f"Applying AI transformation to {config.path}")

def upload_image(config: Config):
    bucket = config.special_bucket_name if config.is_special_object else config.upload_bucket
    logger.info(f"Uploading to bucket: {bucket}")

    with open(config.path, "rb") as file:
        boto3.client('s3').put_object(Bucket=bucket, Key=config.object_key, Body=file)

if __name__ == "__main__":
    config = init_config("example.jpg")
    image_pipeline(config)
```

You can even avoid having to pass around the config to each function with just a function called `get_config()` which would return the config object.

***

## 3. Ensure the types are what I think at runtime

This one is the worst because it's why python, I think, can get a bad rap with programmers that are used to Java or C++. More than I want to admit, I’ve written some python code that seemed fine, I probably should have written more unit tests, but it worked fine. So I push it to deployment in the dev environment and it breaks something. I missed a `None` that was returned, or an API that I was calling returning a nested nested dictionary when I was expecting just the list of strings. The list can go on and on, but it comes down to that one of Python's strengths is also a weakness: its **type flexibility**.

So for that reason, when you have data coming from an external source, just throw it in a Pydantic model. If it passes, great. If not, then you hopefully can fix it more quickly.

Stay safe out there! Check your types, don’t code while driving, and enjoy your weekends by not working!