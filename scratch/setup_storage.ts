
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupStorage() {
  const { data: buckets, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
    return
  }

  console.log('Buckets:', buckets.map(b => b.name))
  
  const bucketName = 'site_dm_advogados'
  if (!buckets.find(b => b.name === bucketName)) {
    console.log(`Creating bucket ${bucketName}...`)
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/x-icon', 'image/jpeg', 'image/svg+xml'],
    })
    if (createError) {
      console.error('Error creating bucket:', createError)
    } else {
      console.log('Bucket created successfully')
      
      // Set bucket to public
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true
      })
      if (updateError) console.error('Error updating bucket:', updateError)
    }
  } else {
    console.log(`Bucket ${bucketName} already exists`)
  }
}

setupStorage()
