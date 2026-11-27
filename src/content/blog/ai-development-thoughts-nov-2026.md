---
slug: ai-development-thoughts-nov-2026
title: AI development thoughts in November 2026
description: Just a short checkpoint on all of my thoughts that have been
  happening this last year. It’s been a whirlwind.
author: Bryson Meiling
pubDate: 2026-11-26
updateDate: 2026-11-26
mediumLink: https://medium.com
keywords:
  - AI
  - Learning
image: ../images/IMG_3183.jpeg
---
It’s been quite a time for software developers. I think a lot’s changed. *Understatement of the year.* Even thinking about it, I’ve changed jobs, I’ve picked up new clients, learned new skills, and I’m still learning quite a lot. In fact, I’m probably working way more hours now, and working on bigger projects than I was a year ago.

## The year of agents

I’m not trying to make this really long; I’m also not gonna try to fact check myself; it’s just a little bit of my reminiscing. This for sure has been a year of __agentic__ software development. I was kind of against a lot of it. I was all for throwing in a prompt and getting some HTML back, and I’ve never been particularly skilled with CSS, but I knew how to make some things work. I really actually went down the Tailwind CSS bandwagon, because for my brain that actually made the most sense doing it by hand. But frankly, I haven’t really cared much about CSS this year because in a lot of ways, it’s easier just to have the agent make up the style sheet.

That doesn’t mean I’ve given up on the system. I’m still firm on setting up the styling and UI token foundation **before an agent touches anything**. I lock in the design styles first — right now I’m happy with the [shadcn](https://ui.shadcn.com/) token foundation — and then I use linters to enforce that it doesn’t drift. [Tailwind](https://tailwindcss.com/) isn’t bad; it’s actually still my preference. A strict system just matters more than ever.

Agents are here. I saw a lot of agentic frameworks that have kind of crashed and burned. I saw [n8n](https://n8n.io/), [OpenClaw](https://openclaw.ai/), and [OpenHermes](https://nousresearch.com/). I thought those were all super cool for about a month, and I tried to get them up and running, but I bounced off because they were pricey, security nightmares, and having an [always-on agent](https://en.wikipedia.org/wiki/AI_agent) didn’t bring much value to me. **Surprise, surprise,** [Dots](https://openai.com/index/introducing-dots/) and [Muse](https://muse.ai/) are not for me even today.

Also, this year, I was really big into having all my development happen on an old laptop that I installed [Pop!_OS](https://pop.system76.com/) on. It was always plugged in. I took the battery out so I didn’t accidentally blow the battery on it, but it is one of those old janky HP laptops. And for a while, it was pretty sweet. I was able to use [Termius](https://termius.com/) on my iPhone to SSH into that laptop, and then do some development for clients while I was at the park with my kids. Looking back, it was a little clunky, and I was not present entirely at the park, so I didn’t love doing that. Coding on a phone is always clunky, even with a lot of voice prompting. These days I just add ideas to my notes or the task list and pick up the work later. It’s also kind of lame in retrospect to be connected to work all the time. Take a break, smell the roses, touch grass.

## The work

So where are we at now? Sadly, I have not typed as much code as I thought I would be doing. My development is really done with [Codex](https://openai.com/codex/), [OpenCode](https://opencode.ai/), or [Claude](https://www.anthropic.com/claude). For me, I really don’t care about which one I’m using; it’s just basically based on who’s paying for it. If I’m paying for it, I’m usually using [OpenRouter](https://openrouter.ai/) with [DeepSeek Flash](https://www.deepseek.com/). If someone else is paying for it, I’ll use whatever system they want me to use. **Tool loyalty is a luxury for people who aren’t paying the bill.**

Implementing code has never been easier, but it’s now even easier to do weird things in code. And while my ability to actually write a little bit of code is probably actually a little bit worse, I’ve become much more opinionated on how I want to implement code. It takes **earned experience** to have opinions; otherwise you’re just a CTO telling your engineers you have a great idea and you [vibe-coded](https://en.wikipedia.org/wiki/Vibe_coding) something over the weekend. And I’m constantly trying to pare down the scope of work that these agents keep on trying to do. **They want to do everything.** They don’t tend to follow great architecture patterns or abstractions. I end up working on codebases where I have a duplicate of the same function.

On the other hand, it’s been great to get better with [worktrees](https://git-scm.com/docs/git-worktree), and I find that for me, when I have a task list to work off of, agents do the best. And agents do the best just because you’re getting structured work and a clear stop and start signal. I’ve done this on personal projects using markdown files, and each markdown file is a task. I’ve also done this in [Jira](https://www.atlassian.com/software/jira), [Linear](https://linear.app/), [ClickUp](https://clickup.com/), [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects). It’s all the same in my opinion. It just encourages you to sit down and make a meaningful task.

And where does a lot of my effort go? I’d say it goes into reviewing and writing good tasks. Not only is it good for agents, but it’s also great for getting credit. The software factories with little to no input are bound to be [stochastic parrots](https://en.wikipedia.org/wiki/Stochastic_parrot); maybe with enough spend they get somewhere, but most companies working on small things can’t spend that money or time wandering in code.

And the [CYA](https://en.wikipedia.org/wiki/Cover_your_ass) is real. **Cover your ass.** Being a good developer still doesn’t get you moving up the ladder or getting bonuses; there’s still and always will be a need to be personable. Always keep documents and subtly toot your horn to your bosses about why you’re worth keeping around.

My effort also goes into enforcing good architecture, modularity, coding standards, etc. I lean on a lot of linters for that — [Fallow](https://github.com/fallow-rs/fallow) for TypeScript is a favorite right now. It’s so easy to let a week’s worth of tickets and development slide, and then suddenly there are duplicate helper functions, the flow of data is unclear, and there are just so many 'okay' code practices that tumble into spaghetti. **It’s even more spaghetti because I didn’t write every line now.**

I do end up doing more rewrites. I rewrite API boundaries across my code. I think a lot about ways to improve things. It’s all about self-preservation, because I’m the maintainer for projects so I want to keep things easier for my future self.

## The Wild West

Overall it’s the Wild West. I’m really getting sick of the LinkedIn bro poetry that comes out of all of these AI models. It shows up all the time in code documentation, and it’s a pretty easy giveaway. I hate reading articles about how my job is gone and software engineering is a thing of the past. It doesn’t feel like that. In fact, **my ability to understand what is happening feels more valuable than ever.**

I had a complicated epic to get done. I spent weeks throwing work at the agent to make tickets based on what the epic said, then implement the code. It was a bad cycle of the agent planning and executing on work it thought had to be there. I didn’t take the time at first to understand the user’s needs or the underlying data formats, and it was a waste of 2 months. **Me understanding my work is worth more than months of an agent spinning its tokens into entropy oblivion.**

At my company, they are using various 'quick app platforms' like [Bolt](https://bolt.new/) or [Replit](https://replit.com/) to make various one-off or prototype apps. They are pretty fun and easy for showcasing something during an all hands, or making an interesting game.

But I’ve had a Replit handed to me for a larger prototype: a reconciliation UI and engine for analysts, plus a workflow for further operations. While it was a great handoff and got the intent across, it’s still been over 2 months of unwinding the Replit rat’s nest of code, reworking UI that was really so complicated and unintuitive for users. It takes a lot of attention, **_taste_**, and just work to make the interactions for users better. I don’t know if AI is going to take this away.

## The money

Maybe things aren’t stabilizing so much as nothing is exciting anymore. Agents are normal. [LLMs](https://en.wikipedia.org/wiki/Large_language_model) are now just a fancy Google search for good recipes, random facts, summarizing meeting notes, and students cheating on homework. **New is old, and that is the story of life.**

And with massive money in AI still trying to recoup costs, I don’t think 2027 is going to be a good year for stocks, or startups. I think valuations have to come down because the money is simply not there.

From what I understand, the majority of the tokens being used are by developers. We’re the demographic that most uses AI and the longest running agentic loops, and we are willing to pay for it because we can get massive ROI from it. I think last month I spent **$800** on AI tokens at my job, but I’m working on a multimillion dollar project and I’m trying to get it done in a few months, so yeah, it’s worth it. I also suspect the token bill is high at my company and I’ll have to cut it soon.

I don’t know of a single other person in my life, thinking about, like, my siblings that have other professions, or friends and family, or even colleagues outside of software engineering that are using AI as much as I do. Granted, a lot of people will use it for summarizing meetings.

Job market is still sucky and stagnating. There are a lot of economic headwinds that are making this worse outside of the AI psychosis-induced layoffs. Is it a depression? Is it getting back to pre-pandemic headcount levels? Is it AI making it more obvious that some teams are better than others? **My money is on the last one.** AI just makes it easier to see which teams were already being carried.

## So, anyway

**I’m done SSH-ing in from the park.** I’m going to try to keep my job, enjoy my life and family, leaving work at work. Life is too short to not life it.
