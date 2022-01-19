# Guider Website proxy

This proxy makes communication with the Guider c++ backend easy and secure.
Instead of having direct access to the TCP socket build into Guider. This Proxy
provides a HTTP(s) websocket translation layer. This way the frontend website
can connect using the buildin websocket protocol which is widely supported in
all modern browsers over "MILITARY GRATE" ;) encryption. (Just standard SSL).

# Run this project

Install `Deno v1.17.2+` over at https://deno.land/

Run `deno run --allow-net mod.ts <guider-hostname>`

You can now connect to `ws://127.0.0.1:8443/ws`
