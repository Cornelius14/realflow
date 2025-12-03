import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/admin/login")
  }

  // Fetch all deal finder requests
  const { data: requests, error } = await supabase
    .from("deal_finder_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching requests:", error)
    return <div>Error loading requests</div>
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-gray-900">Deal Finder Requests</h1>
          <p className="mt-2 text-sm text-gray-600">Manage incoming deal finder form submissions</p>
        </div>

        {requests && requests.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">No requests yet. Submissions will appear here.</Card>
        ) : (
          <div className="space-y-4">
            {requests?.map((request: any) => (
              <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                      <Badge className={statusColors[request.status] || "bg-gray-100"}>{request.status}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                          {request.email}
                        </a>
                      </p>

                      {request.company && (
                        <p className="text-gray-600">
                          <span className="font-medium">Company:</span> {request.company}
                        </p>
                      )}

                      {request.phone && (
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span>{" "}
                          <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                            {request.phone}
                          </a>
                        </p>
                      )}

                      <div className="pt-2">
                        <p className="font-medium text-gray-700 mb-1">Request Details:</p>
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                          {request.request_details}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 pt-2">
                        Submitted: {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
