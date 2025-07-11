// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts
import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}