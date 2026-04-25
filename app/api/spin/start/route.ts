export async function POST(request: Request) {
  const spinId = Math.random().toString(36).slice(2)

  return new Response(
    JSON.stringify({ spinId }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  )
}