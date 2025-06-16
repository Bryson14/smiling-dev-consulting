---
slug: stop-making-your-python-projects-like-it-was-15-years-ago-
title: Stop making your python projects like it was 15 years ago…
description: I have a few things I’ve seen across companies and projects that I’ve seen working with Python that are annoying, hard to maintain, and are antiquated. Lets jump right in
author: Bryson Meiling
pubDate: 2024-09-28
mediumLink: https://medium.com/gitconnected/stop-making-your-python-projects-like-it-was-15-years-ago-125436b470a5
keywords: ["Software Development", "Python" , "Software Engineering"]
image: "../images/stop-making-your-python-projects-like-it-was-15-years-ago-125436b470a5.png"
---
![A sad programmer thinking about the time wasted with python project management and debugging](../images/stop-making-your-python-projects-like-it-was-15-years-ago-125436b470a5.png)

I have a few things I’ve seen across companies and projects that I’ve seen working with Python that are annoying, hard to maintain, and are antiquated. Lets jump right in:

## Use PyProject.toml instead of requirements.txt

Don’t do it. Stop putting in your README.md 

> install dependencies with pip install -r requirements.txt

Can pip do it? Yes. Should you? No. requirements.txt is a accidental standard. Just use `pyproject.toml`. It makes sense, pip understands it, you can define dev and groups of dependencies in it so you don’t have to start using “dev-requirements.txt” and a slew of cicd pipeline rules.

See [this python subreddit conversation](https://www.reddit.com/r/learnpython/comments/1bmxe6i/whats_the_difference_between_pyprojecttoml)

## Use a python version and project manager like Poetry or UV

I’m partial to UV, but I like Poetry too. They both will read the pyproject.toml file, handle dependencies, building, running applications in sandboxes, managing version of python and more. It will take you an hour to read about these tools and it will save you head ache.

At a bare minimum, use a virtual environment like `venv` to save yourself some global dependency headaches.

Also `UV` will install dependencies way faster than pip.

## Use Type hints

Type hints are great for readability and helping linters like ruff and mypy know what the hell is happening in your code. Your coworkers will like your code better too.

This is hard to understand when I have to pick up your code 2 years later:

```py
def do_something(data):
  for x in data:
    for y in data[x]:
      transmute(data[x][y])
```

Make it easier:

```py
def alter_map(data: Map) -> None:
""" Alters data in a 2d map. Alters the object refernced directly
"""
  for x in map:
    for y in map[x]:
      transmute(map[x][y])
```

Add type hints to all parameters in functions, return types, etc.

## Add a Raises section to your function docstrings

This might be controversial because people will say that it doesn’t stop bad code or enforce anything, but it still helps to maintain code.

In your docstrings, add a Raises and the possible exceptions that can be raised from this function to minimize surprises:

Now this is helpful!

```py
from typing import Dict, Any, optional

def query_db(query: SqlQuery) -> Optional[Dict[str, Any]:
  """Calls the database
  Args:
    ...

  Raises:
    ClientException: you goofed up
    TimeoutException: db took too long
    ConnectionException: something is wrong with your network

  Returns:
    The response from the query, if any.
  """
```

## Use Pydantic Models to pass around data and parameters over dicts or numerous function parameters

I’m tired of code I see that has functions that essentially prop drill with pieces of data that don’t change. This a data processing pipeline that has a bunch of environment variables that get looked up once and never change. Just define a pydantic class and boom, you have error handling, type checking, and can pass that around as a single argument to functions.

## Use a linter and formatter like Ruff
Javascript projects have prettier and its a near standard at this point. In Python, use ruff (which copies Black’s formatting standard) and its fast. it also will lint common issues that you might have missed. this linting is not as in depth as a static analysis tool like mypy, but sure does help.

While you’re add it, add a few of these opt-in rules into your pyproject.toml to make your code base even better:

```toml
[tool.ruff]
target-version = "py12"

[tool.ruff.lint]
extend-select: [
  'D', #pydocstyle
  'E', 'W', # pycodestyle
  'F', #pyflakes
  'I', # sort imports
  'UP', #pyupgrade
  "RUF",  # ruff dev's own rules
  "SIM", # pyflakes simplicity
  "C90", # more complexity rules
]

[tool.ruff.lint.pydocstyle]
convention = "google"

[tool.ruff.lint.isort]
combine-as-imports = true
split-on-trailing-commas = false
```

There are many things you can add here. But is al a carte.

## Use Pytest over unittest
Where is makes sense to convert, use pytest over unittest. The pytest fixtures are very helpful and composable.

## Hot Takes If You Can Manage To Sneak This Into Your Projects
- Use orjson instead of the built in json library
- Always use f strings instead of string concatonation or .format or %s formatted strings
- Use pathlib instead of os.path
- Use [click](https://click.palletsprojects.com/en/stable/) or [typer](https://typer.tiangolo.com/) instead of argparse or heaven forbid, sys.argv
- Upgrade to python 3.8+


*Thank you for coming to my soapbox Ted Talk.*