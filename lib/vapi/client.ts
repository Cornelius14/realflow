import Vapi from "@vapi-ai/web"

// Pure client instance - no side effects, no DOM access
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!)
