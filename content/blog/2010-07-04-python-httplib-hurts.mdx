---
title: httplib uses print for debugging
author: Aron
tags: [python, httplib, n01se]
excerpt: Oh it hurts...
layout: article
---

**UPDATE**: [Duck-typing to the
rescue](/2010/08/29/python-httplib-debug.html)

At work we have a production site that uses httplib (via httplib2) on the
server to communicate with internal servers using a RESTful API. When
something doesn't work as expected in this process, we like to know about
it, so our app sends email with the exception traceback and whatever
relevant data we can pull together.

One of the pieces of data I'd like to add to the email is the conversation
between our server and the internal servers. On a development server, this
is easy: Set httplib2.debuglevel=1 and watch the HTTP conversations scroll
past on stdout.

On a staging or production server, one quickly discovers a crippling
mistake made by the httplib authors: the library uses Python's "print" for
debugging!

If the application were single-threaded, we could capture the trace by
temporarily redirecting sys.stdout to an instance of StringIO (maybe using
a context manager). Sure, it's more load on the server to capture the debug
on every transaction, but I'll gladly pay that price for the hours we'll
save when something goes wrong and we have the ability to debug it.

But it doesn't matter, because we haven't this option. Our app is
multi-threaded and sys.stdout is global. We would have to serialize our
HTTP transactions to prevent traces from being mixed together. Or fork to
isolate sys.stdout. These aren't realistic approaches.

This sort of unfortunate shortcoming is to be expected in add-on libraries.
After all, part of the reason they're not included with Python is that they
don't necessarily meet the quality requirements of the core distribution.
But I'm taken off-guard to find such an obvious shortcoming in the Python
standard library. One of the things I'd hope to assume by using the
standard library is a trust in the quality of the implementation, but
a discovery like this forces me to question that assumption.

I'm pretty new to Python, so maybe I'm missing something. Is httplib
a particularly poor example of the Python standard library? The existence
of httplib2 seems to imply that (and also seems to imply that it's hard to
get problems fixed in the core distribution). Maybe I need to find an
add-on networking library that ignores httplib entirely...?

(originally posted on the [n01se blog](http://blog.n01se.net/blog-n01se-net-p-213.html))
