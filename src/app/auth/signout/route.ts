import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll()
        },
        async setAll(cookiesToSet) {
          const store = await cookieStore;
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set(name, value, options)
          })
        },
      },
    }
  );

  await supabase.auth.getUser();   // load the session into memory
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
}
