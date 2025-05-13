import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function supabaseFromReqRes(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )
}

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const redirect = NextResponse.redirect(new URL(next, requestUrl.origin))
    const supabase = supabaseFromReqRes(req, redirect)

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/login?error=oauth', requestUrl.origin))
    }

    // ensure profile row exists
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.log("user error-=-=-=", userError)
      
    }
    if (user) {
      const { data: upsertData, error: upsertError } = await supabase
      .from('profiles')
        .upsert({
          id: user.id,
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? 'User',
          avatar_url: user.user_metadata?.avatar_url,
          created_at: new Date().toISOString()
        })
        if (upsertError) console.error('UPSERT error →', upsertError)
        else console.log('UPSERT ok →', upsertData)
    }

    return redirect
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=oauth', requestUrl.origin))
}
