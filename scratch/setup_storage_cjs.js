
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupStorage() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }

    console.log('Buckets:', buckets.map(b => b.name));
    
    const bucketName = 'site_dm_advogados';
    if (!buckets.find(b => b.name === bucketName)) {
      console.log(`Creating bucket ${bucketName}...`);
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      if (createError) {
        console.error('Error creating bucket:', createError);
      } else {
        console.log('Bucket created successfully');
      }
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

setupStorage();
