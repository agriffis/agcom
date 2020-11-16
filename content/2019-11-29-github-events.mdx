---
title: GitHub personal timeline
excerpt: Using the GitHub API to fetch and query user events
author: Aron
tags: [github, bash, hack, jq]
layout: article
---

GitHub doesn't seem to have a page that shows my comprehensive personal
timeline. I notice this when I comment on a commit--it's hard to find and easy
to lose track of, especially when the committer hasn't responded yet.

The information is available from the [user events
API](https://developer.github.com/v3/activity/events/), though. This API is
fairly primitive, with no ability to search or filter. Results are split into
pages of 30 events each, with up to 10 pages available for the most recent 300
events.

There are a couple ways to approach such an API. One way is to write an
all-in-one tool that fetches responses and runs queries against them. That's
complicated by paging, though, and slow to run because it needs to make the API
calls each time. I could keep a cache between runs, but that trades off
simplicity for speed.

Another approach is to separate concerns by writing a fetcher that stores the
responses locally, then I can query against my local database. One advantage of
this approach is that I can run the fetcher periodically to update the local
database, so over time I can accumulate a history that's longer than the 300
events available from the API.

Here's the fetcher: [fetch-github-events](https://github.com/agriffis/github-events/blob/master/fetch-github-events)

If you'd like to try it yourself, you'll need two things:

1. GitHub's [hub command-line tool](https://github.com/github/hub) for making
   authenticated API calls. Sign in by making an API call with `hub api
   user`--the tool will save your API token in `~/.config/hub` for later use.

2. Stephen Dolan's [jq JSON processor](https://stedolan.github.io/jq/) for
   working with the API responses. jq is available in most distributions, for
   example on Fedora it's `dnf install jq`. If you haven't heard of jq before,
   take a moment to read about it--jq is as indispensable for working with
   structured data as grep and awk are for ad hoc text.

Once you have those, you can run the fetcher:

    ✸ fetch-github-events
    Fetched 297 events

I don't know why GitHub only returned 297 events. It seems like sometimes the
last page isn't fully populated. If you run the tool again later, it will fetch
the recent events:

    ✸ fetch-github-events
    Fetched 9 events

If there are no new events, or if the output isn't a tty (when running from
cron) then there will be no output.

The events are stored as JSONL in `~/Documents/github-events.jsonl`. The [JSON
Lines format](http://jsonlines.org) is convenient because we can continuously
append records to the end. Unlike a JSON array, it doesn't need leading and
trailing brackets, nor are records separated by commas. That means it's easy to
see the oldest records with `head` or the newest records with `tail`.

I'm running the fetcher once an hour from cron:

    0 * * * * fetch-github-events

I don't have a separate tool yet for querying. In this case, separation of
concerns meant that I could finish the first part without building the second
part. But it's not hard to make ad hoc queries using jq. Here's the series of
commits against the `github-events` repository:

    ✸ jq -r 'select(.repo.name == "agriffis/github-events") |
        .payload.commits[]? | .message' < github-events.jsonl
    Initial commit
    Initial commit
    Initial commit
    improvement: reduce deps and simplify with hub api command

What, doesn't everybody start a repo with a series of forced pushes until the
"Initial commit" settles?

Now I can track down those commit comments:

    ✸ jq -r 'select(.type == "CommitCommentEvent") |
        .payload.comment.html_url' < github-events.jsonl
