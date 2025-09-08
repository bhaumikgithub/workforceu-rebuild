import React from "react"
import ListingAdminUser from "@/components/ui/users/index"
import CreateAdminUser from "@/components/ui/users/create"

export default function PreviewPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Preview</h1>

      <ListingAdminUser />
      <CreateAdminUser />
    </div>
  )
}
