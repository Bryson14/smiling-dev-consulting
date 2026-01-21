---
slug: why-i-ditched-my-java-backend-for-hono-and-ai-interns
title: Why I Ditched My Java Backend for Hono and AI Interns.
description: A practical look at using AI agents to rewrite a Java Spring Boot backend service into a TypeScript Hono serverless application, achieving better performance with less maintenance overhead.
author: Bryson Meiling
pubDate: 2026-01-21
mediumLink: https://medium.com/@BryMei/why-i-ditched-my-java-backend-for-hono-and-ai-interns-7eb8327fce64
keywords:
  - AI Agents
  - Spring Boot
  - Hono
  - Serverless
  - AWS Lambda
  - Backend Development
  - Rewrite
image: ../images/washington-trees-arc-bridge.webp
---

I have started to get more into the world of AI Agents as tasks. Well, I think nearly everyone has. It feels like in some ways the best tool I have right now but also the biggest crutch. This is only **exacerbated** by family life with kids under 5 because they are keenly aware of where I am in the house. I lean on using AI agents often now because I can have a few ideas on how to get something done, walk over to my computer and tell my AI interns how to get it done. The more specific the better. Then I tell them to go to work while I mediate fights between siblings over toys without resorting to screentime. In some ways, it is the best **thing** I can have as a busy dad because it allows **me** to focus on just the high-level problem solving while leaving the details to something else. I imagine I'm not the only one with **these** kinds of work/family commitments that can benefit from an always-on agent.

> Sidenote: I really enjoy the process of writing as a way to learn and solidify my own experiments. For that reason, I don't use LLMs to write articles for me.

## Why rewrite?
We have a Java service that has been running now for a few months and it does its job. It runs okay enough, but if I'm being honest, I hate working with Java. I can appreciate how widespread and important Java is **as** a language and for infrastructure code, but honestly, it grinds my gears every time I work with it. I'm not that great with all the details either. So every time **it's** my turn to work with this backend service, I'm already leaning on LLMs to do 90% of the work. What is a Java bean? Why **are there** 4 different `.properties` files? Why does every Java component feel the need to add more **boilerplate** code, more configuration, and less actual code that I can reason about? Instead of seeing `this middleware code is running here`, it's some innate knowledge about JWT middleware configured in some file that I need to know about to be proficient.

Why Not! I have a fairly small service that has less than 30 routes. It interacts with only 1 database and blob storage, so it should be pretty easy.

## Old to New Architecture
For a backend service like this, **it** is fairly small, isn't going to be used by a large audience (less than 100 req/second), and **maintenance** and cost **are** important since I'll probably be the only engineer to really dig into this—everything else in the future will be me again or an engineer just trying to make a quick fix. I **chose** Hono since I can deploy it on Lambda. I'm putting all the routes together so a single **Lambda** can be **an** entire backend. This makes development faster, easier to reason about, and **lessens** complexity when I need to focus on the **inherent** complexity of the rewrite.

If this was a larger or more used system, I would reach for some other architecture. Serverless is often great for developer experience, **bursts** of requests, and cost at low **amounts**. But it can fail on latency, cost at high throughput, and background tasks. Since we are not dealing with a system that requires these features, we can be happy with serverless compute using Lambda.

The old architecture was a Spring Boot server running on ECS. This should have a faster response time since the server is always **running**, but as I found later on, I was able to match or beat the latency for the response time with the Lambda server for every route. This is probably due to **an** under-provisioned ECS container (0.5 vCPU) or just bad code that calls databases and other internal systems sequentially instead of parallelizing network calls where possible. That is always something nice with a rewrite: some obvious improvements are sometimes easy to catch.

> As a side thought, I've wondered if many projects would be improved if you could spend a few hours quickly making the first revision, then throw it away and spend more time building it again now that you have the concept in mind. Kind of the same idea as building many projects as a method of learning.
> As a side thought, I've wondered if many projects would be improved if you could spend a few hours quickly making the first revision, then throw it away and spend more time building it again now that you have the concept in mind. Kind of the same idea as building many projects as a method of learning.

## What worked pretty well
I've found more and more that when I am opinionated and have **an** idea of how I want the system to appear, things turn out better. Without an opinion guiding the design, the design then defaults usually to the most popular pattern in the model's training corpus. This might **be an** older build system like create-react-app, or running everything with NextJS, which is often not the system I want to use.

First, I set up all the **apps**, the build system, any dependency that I want to use, linters, formatters, skeleton routes and pages, server functions, etc. I want to make all the personal decisions **myself** and then let the LLM bang out code.

Next, I set up skeleton routes that just returned `TODO` in Hono. My focus was on the [OpenAPI generation](https://hono.dev/examples/hono-openapi) so that I can confirm the system is generating the same OpenAPI schemas as **are** currently defined for the Spring Boot service. This ended up working well because I'm matching the old system right from the get-go based on its contract of what it _should_ do.

Once I was happy that the Hono server was generating an OpenAPI spec file that was identical to the old system, then I could start on the implementation of the routes themselves.

For each route, I had a quicker model like `Claude Haiku 4.5` run through the Java **code** for each route with a prompt like this:

>I am working on rewriting this system into another language. For that reason, I need to document everything that happens with the request of `GET /users`. Everything that happens in the Spring Boot service, including authentication, authorization, JWT **assumptions** about claims and audience, middleware, logging, database interactions, database assumptions, internal API calls, possible error locations and other error handling, and response types need to **be** documented in a **thorough** design document.

Then I ran this N number of times for the N routes that existed in the backend service. This ended up taking probably an hour, but it produced some pretty decent documentation.

Then I took each design document for each route and gave it to a better model like `Claude Sonnet 4.5` or `Claude Opus 4.5` with the instructions to "recreate this API route given the design document."

The first few times, it **made** some strange functions, repetitive helper functions, or calls to systems that were not set up. But after some massaging and tweaking, **it** went smooth. The second half of the routes were prompted **and** made almost effortlessly. The helper functions and **util** classes were already set up, so the **implementation** of the routes at that point **was** quite easy.

## The results

I used [hyperfine](https://github.com/sharkdp/hyperfine) to benchmark the results. I could have made **something** more **sophisticated**, but often Linux tools are just what the doctor ordered.

Below is the example call to the running backend server with Java on ECS. I was kind of shocked because this service was made by another engineer and the response time of 5 seconds was pretty bad. Most of the time **it** is just doing unoptimized scans on a DynamoDB system or an internal API. This could **absolutely** be better with actual search indexes, but this **system** gets such low traffic that a few seconds by an employee is not a big deal.


```bash
hyperfine  'curl https://myservice.acme.com/api/users\?limit\=100\&skip\=0 -H "Authorization: Bearer $BEARER_TOKEN"' 
Benchmark 1: curl https://myservice.acme.com/api/users\?limit\=100\&skip\=0 -H "Authorization: Bearer $BEARER_TOKEN"
  Time (mean ± σ):      5.035 s ±  0.573 s    [User: 0.018 s, System: 0.013 s]
  Range (min … max):    4.554 s …  6.284 s    10 runs
```

| Metric             | Value   |
| ------------------ | ------- |
| Average            | 5.035 s |
| Standard Deviation | 0.573s  |
| Min                | 4.554s  |
| Max                | 6.284 s |
| Count              | 10      |

### Hono results

| Metric             | Value   |
| ------------------ | ------- |
| Average            | 0.719 s |
| Standard Deviation | NA      |
| Min                | 0.601s  |
| Max                | 1.099 s |
| Count              | 17      |


So it turned out pretty well! Most of the routes had **a** latency improvement from **1.1x** to 4x. Not bad for a **day's work** on a system that we want to set up and basically forget about for the next year. Many systems in enterprise need to be easy to refactor, **yet** will be forgotten before an engineer picks up a story to add a new feature. The systems are often undocumented or worse, incorrectly documented. Making the system **explicit** with Hono's middleware statements, clear with types, and **running** in a serverless environment is a big win for many low-use big company backend services.

Other benefits that I didn't expect was that the CICD pipeline was much faster. While the Java service required building the java into a JAR file, packaging as a docker image, uploading to ECR, deploying with AWS CDK, then waiting for the ECS service to restart to a new task definition, the new lambda service could build the javascript into a `dist/` file in 30 seconds, upload to S3 as a zip file in 10 seconds, and then CDK would complete in 2 minutes because lambda can swap out source code much quicker than starting a whole docker image. Nice win that I didn't plan for. 