---
slug: rust-shined-over-python-for-my-cli-tool
title: Rust Shined Over Python for My CLI Tool
description: I rewrote a 12,000 line python CLI in rust in a week. But the real
  advantage wasn’t speed or performance, it was confidence!
author: Bryson M
pubDate: 2026-03-10
updateDate: 2026-03-10
mediumLink: https://medium.com/@BryMei/rust-shined-over-python-for-my-cli-tool-22ea02e5df2a
keywords:
  - Python
  - Rust
  - ClI Tools
  - Rewrite
image: src/content/images/IMG_0754.png
---
I have really been enjoying the new tooling in Python, let me just start out with that. What the team at Astral has been doing with uv, Ruff, and Typo has really pushed the tooling and developer experience. For a lot of things, Python is the right way to go. It's quick and "fast enough." Most developers are proficient in Python, even if they don't know it well. AI tools can rip through it. So why consider Rust?

## Automation Tooling

Here is the context. I was making a new tool for a company that centered around the command line. I'm being intentionally vague about the purpose, but it would take data, convert and standardize it, then upload that data in a special format. Also, uploading the data usually required setting up the environment and data in the application via API calls before uploading a new batch of data. So really, it's mainly just some light conversions and then a bunch of HTTP calls to deal with a funky API design.

In this context, Python's performance has no significant difference compared to Rust, considering most things are just waiting for the network.

In this case, my reasons were reliability and seeking a feeling of robustness.

## Where Python Started to Feel Difficult

While tooling, type hints, and linters can help significantly, ultimately a level of complexity begins to emerge throughout the application. Adding validation with Pydantic and assert statements are all good, but it's hard to reason over so many invariants at once.

Also, Python's exception handling is fine, but when compared to Rust, it's hard to go back. Result and Option enum error handling in Rust can be verbose and annoying in some cases, but when you're very concerned with every error and trying to recover from most of them, it's fantastic! I don't want to have tons of try-except blocks everywhere. How can Python functions fail, and how will they fail? I don't have any concrete information for most functions about the types of exceptions they might throw just by looking at the code. It requires a lot of testing.

Testing was another area where I thought Python would shine. Mocking is easy—you can mock the database, API, configs, and everything else. In the beginning, Rust was a bit trickier to test. For structs and functions that dealt with API or client inputs, it wasn't clear how to mock that. There's mockito, but then reading some Reddit posts, I realized that traits are often the answer. Instead of making a function like `fn get_posts(&client: &MyClient, data: PostUpload) -> Result<>`, it's better to use a trait:

```rust
trait HttpGet {  
  fn get(data: serde_json::Value) -> Result<>;  
}  

struct MyClient {}  

impl HttpGet for MyClient {  
  fn get(data: serde_json::Value) -> Result<> {  
    reqwest.get()?  
  }  
}  

fn get_posts<T: HttpGet>(client: impl HttpGet, data: serde_json::Value) {  
  client.get(data)?  
}
```

So why is this different? Well, now I can make a `MockClient` in the tests module and have the mock client return the response I want. It's extremely clear, testable, and I'm not doing runtime import mocking or clobbering. No more Python monkey-patching where I've messed up enough import strings or pytest autouse fixtures that have tripped me up.

Testing surprised me. But given the strictness of the type system, plus the in-file test blocks at the bottom of some files, it made testing very helpful and easy to reason about. It allowed me to worry less about having hundreds of tests (I think I had around 800+ in the Python CLI tool) and more about having a few solid tests that help me "lock down" the behavior of each submodule. Integration tests are still important but tend to be less extensive than Python because I'm not trying to stress every edge case that Python left unclear.

## The Results

It took me around 10 weeks to build the Python code. Then there were more requests and features to add that took another 2 weeks. Every change required more testing and made me feel unsure if it would work. Total lines of Python code:

Including test files: 23,598  
Excluding test files: 11,166

It took me a week to rewrite the Python code in Rust. Certainly, having done it first in Python sped me up significantly. I had already learned the quirks of the internal API system we use, and I'd been bitten by the serialization requirements before. I had plenty of test files and checks that I could simply move over.

Lines of code in Rust: 20,055  
Lines of code excluding Test Blocks: 14,946

## Other Benefits I Didn't Expect

Distributing a Rust binary is much easier than a Python build. I had instructions for users to clone the repository, install `uv`, and then set up the Python environment. I also built a Docker image they could pull, but not every engineer had their artifactory token set up to pull the private Docker image.

However, with Rust, I was able to get cross-compilation working. It now compiles to ARM 64 macOS, Windows x86, and Linux. It's fantastic. I recommend users download the binary directly from the repository's artifacts, but I also have a small MUSL Linux Docker image built for those who prefer using Docker.

Another nice benefit is that the Rust binary starts up very quickly. I mentioned that performance wasn't a driving factor, but it does feel nice to have a CLI tool start immediately. It feels crisp and tight!