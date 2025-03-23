import prisma from "@/lib/prisma";


// This makes the page dynamic rather than static
export const dynamic = "force-dynamic";


export default async function ProfilesPage() {
  // Fetch profiles from the database
  const profiles = await prisma.studentprofile_studentprofile.findMany();


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Student Profiles</h1>


      {profiles.length === 0 ? (
        <p className="text-gray-500">No profiles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">LinkedIn</th>
                <th className="py-2 px-4 border">Desired Role</th>
                <th className="py-2 px-4 border">Industry</th>
                <th className="py-2 px-4 border">Year</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 bg-gray-600">
                  <td className="py-2 px-4 border">{profile.id}</td>
                  <td className="py-2 px-4 border">{profile.name || "N/A"}</td>
                  <td className="py-2 px-4 border">{profile.email || "N/A"}</td>
                  <td className="py-2 px-4 border">
                    {profile.linkedin_profile || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {profile.desired_role || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {profile.preferred_industry || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    {profile.current_year || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}





