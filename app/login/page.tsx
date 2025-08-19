"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl mb-4">Sign in</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await signIn("credentials", { email, password, callbackUrl: "/" })
        }}
        className="space-y-3"
      >
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full border p-2 rounded" type="submit">
          Continue with email
        </button>
      </form>

      <div className="my-4 text-center">or</div>

      <button
        className="w-full border p-2 rounded"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </button>
    </div>
  )
}



