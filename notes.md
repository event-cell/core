What do you want?
- Live timings on a public webiste
    - "Live" - updated once a minute
    - The same as the displays
- Last sent data should persist
    - We want to be able to save for previous timings (e.g. view last months by date)


- Search for name and return all results

We have:
- Server - Database -> http
- Client - http -> display

Solution:
- Put the client on a public thing
- Dump the api response

Knowledge gaps:
- Don't know how to save api calls
- Don't know how to publish the client
- Don't know how to link to multiple events

Proposed solution

/index.html         - File with all of the past events on it (static file)
/yyyy-mm-dd/display/     - Client instance (cd client && yarn build)
/yyyy-mm-dd/api/... - Data
Need: 'currentcompetitor.number', 'cometitors.list', 'runs.count'

tprc.useQuery(...) -> /__trpc/...

Deploy on a server
- Use Caddy (like nginx but no fucking with ssl)
- Create a rule that takes /*/display/* and redirects that to the result of yarn client:build
- For each date fill out /{date}/api/simple/*.json with e.g. wget response
    - Could just mount this with sshfs or use scp or something to do this inside of node

