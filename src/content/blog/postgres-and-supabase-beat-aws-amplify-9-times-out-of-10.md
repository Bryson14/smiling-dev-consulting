---
slug: postgres-and-supabase-beat-aws-amplify-9-times-out-of-10
title: Postgres and Supabase beat AWS Amplify 9 times out of 10
description: Don’t try to bring disjointed technologies and a half made
  developer experience into your next business. Use reliable tools and well
  designed products
author: Bryson Meiling
pubDate: 2025-08-18
updateDate: 2025-08-18
mediumLink: https://medium.com
keywords:
  - Postgres
  - Supabase
  - AI Agents
image: src/content/images/IMG_9667.png
---
# Solid Technology Makes for Good Choices

A few months ago I wrote an article called why AWS amplify might be the best backend framework. I wrote it partly as a way to test my own knowledge of what I’ve done for the last 2 1/2 years. Also, because there was a little bit of truth in the goodness of that framework. However, I am going back on my thoughts, and I am now walking away from AWS amplify for Supabase.

The TL;DR is that using a reliable and flexible, database (Postgres) has dramatically improved the performance of the website, the developer experience and maintenance. Consolidating all back and functions into a single web server (Hono) using typescript has sped up development and improved errors.

so I guess I’m going to be addressing two different audiences here. The first audience is those that are what reading this and genuinely trying to understand what they should build their next app with. The second audience is those that are gonna say, well, of course you should use a sequel database. Why did you start with dynamite DB in the first place? The second audience is partly me now after going through this.

## Project Context

For the last 2 1/2 years, I’ve been making and maintaining a tutoring website. If you wanna give it a check, go to tutorthefuture.com. It started out as massapequatutor.com, and then went to a rebrand, and now it’s even going through another rebrand. The original code that I inherited had a particular data model and was using dynamo DB. So over 2 1/2 years ago, I saw a W simplify as another system using dynamite DB, on AWS, and I thought to myself wow this is great. This will help me with all of my data and API needs.

The promise of AWS simplify is neat, it tries to be a fire base competitor. But ultimately, I think it’s use of Graf QL and Dynamo DB ends being the foot gun. I think they realize this and they have even started going to a AWS amplify Jen two, which is really leaning into all type scripts, and more quick development times. But I still think underneath their storage layer just causes too many issues.

Data and storage

After going through this, I’ve realized that the heart of most applications is the data. I think someone has said multiple times that most applications at their heart are just a database on under a pretty UI. And in this case, it was very true. The amount of times I found myself fighting with the data set up and dynamite. DB was terrible. I tried both leaning into the data duplication and just using no sequel. I tried making the database feel more like SQL, and then doing my own application layer joining over data. But in both cases, it was just terrible. The application code couldn’t guarantee what the data was, also it ended up being a bunch of waterfall network request to get the data that I needed. they use Graf QL an app sync to try and fix that so you can pull multiple pieces of data together, but it only works really for one to one relationships. And even then the performance was just bad. Additionally, dynamite DB only has a one megabyte page limit. So then I was always overthinking how to deal with Paige nation. And some places like admin dashboard where you needed to do different queries and aggregations, I just bit the bullet and I would download all the database from the system, which fortunately only ever got to around 5000 records for the biggest table. And then I would run the aggregations locally on the browser. And I knew it was bad, and maintaining it was bad, and every time the client asked for a different aggregation, or view, or when it update the data. I found myself always fighting The database. I found myself fighting how I was saving data, and making things faster, and also just really making things easier for me to logically understand.

so let’s jump forward to Postgres. I really haven’t worked much with it in my career, so it was a little bit of a learning curve. But I’m very happy that I’ve taken the time to understand it and to get more familiar with how SQL works. It took me probably two weeks to ramp up and learn about the basics of SQL, super bases, and more particularly all the migrations that you can do with SQL. But now it feels so much more manageable. Also the PostgREST API layer that super base uses is just beautiful. It’s so awesome that I can do complex queries just for my client and I’m getting exactly the day that I want. And then if I really do need more complex functions or permission, scoped data, I can drop-down into RLS or database functions that have their own properties and permissions. It’s like someone has put 40 years of thought into these database designs.

I was so dumb in hindsight is that I was trying to do joints in dynamo GB, but it ended up being this waterfall disaster of network request. And so in some of the tables, I tried to get around this by just adding everything into the table, similar to how you would de normalize everything in mango DB. But that just ended up being terrible as well. So it is so great now that I can do native joints and everything just magically pulls together.