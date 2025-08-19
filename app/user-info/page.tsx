import { auth, signOut } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <main className="p-8">
      {!session ? (
        <a className="underline" href="/login">Login</a>
      ) : (
        <div className="space-y-2">
          <div>Hello {session.user?.name ?? session.user?.email}</div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button className="border p-2 rounded" type="submit">Sign out</button>
          </form>
        </div>
      )}
    </main>
  )
}
