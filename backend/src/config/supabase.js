const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("⚠️  Supabase environment variables not set. Database features will be unavailable.");
  // Create a mock query result for development
  const mockResult = () => Promise.resolve({ data: null, error: { message: "Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY" } });
  
  // Chainable query builder mock
  const queryBuilder = {
    select: () => queryBuilder,
    insert: () => queryBuilder,
    update: () => queryBuilder,
    delete: () => queryBuilder,
    eq: () => queryBuilder,
    neq: () => queryBuilder,
    gt: () => queryBuilder,
    gte: () => queryBuilder,
    lt: () => queryBuilder,
    lte: () => queryBuilder,
    like: () => queryBuilder,
    ilike: () => queryBuilder,
    is: () => queryBuilder,
    in: () => queryBuilder,
    contains: () => queryBuilder,
    order: () => queryBuilder,
    limit: () => queryBuilder,
    range: () => queryBuilder,
    single: mockResult,
    maybeSingle: mockResult,
    then: mockResult,
  };

  supabase = {
    from: () => queryBuilder,
    rpc: () => mockResult(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: { message: "Supabase not configured" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

/**
 * Create a Supabase client with a user's JWT for authenticated requests.
 * This allows RLS policies to correctly identify the user.
 */
function createAuthedClient(authToken) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabase; // return mock client
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });
}

module.exports = supabase;
module.exports.createAuthedClient = createAuthedClient;

