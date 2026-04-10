export async function onRequestPost(context) {
  const data = JSON.parse(context.env.data);
  const body = await context.request.json();
  if (data.allow.includes(body.password)) {
    return Response.json({ msg: "Success", status: 200 })
  } else if (data.block.includes(body.password)) {
    return Response.json({ msg: "You Have Been Blocked!", status: 403 }, { status: 403 })
  } else {
    return Response.json({ msg: "Invalid Password!", status: 401 }, { status: 401 })
  }
}
