const CLIENT_ID = process.env.clid;
const CLIENT_SECRET = process.env.clsec;

export async function onRequestPost(context) {

  try {
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: context.data.code,
      }),
    });

    // CHECK IF THE RESPONSE IS VALID BEFORE PARSING
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({})); 
        console.error("Discord API Error:", response.status, errorBody);
        
        // Return the actual Discord error to the frontend for debugging
        return Response.json({{ 
            error: "Discord Error", 
            status: response.status,
            details: errorBody, headers: response.headers
        }, { status: response.status });
    }
    const data = await response.json();
    return Response.json({ access_token: data.access_token });
  } catch (err) {
    console.error("Server Crash Prevented:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
}
