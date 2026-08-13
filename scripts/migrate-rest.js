const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_REF = 'ljvnnpwwmhzdctvflsxb';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const ANON_KEY = 'sb_publishable_cj89SB8B33J4QQqwbxsHhg_MuRmhwsB';

// Read the migration SQL file
const sqlPath = path.join(__dirname, '../supabase/migrations/20260812000001_initial_schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Split SQL into individual statements (split on semicolons, filter empty)
const statements = sql
  .replace(/--[^\n]*/g, '')       // Remove comments
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`📋 ${statements.length} requêtes SQL à exécuter...`);

// Use Supabase REST API to execute each statement via rpc
// Note: For DDL, we need the service_role key. Let's try with the anon key first.
async function executeSQL(statement) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: statement });
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/execute_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🔗 Connexion à Supabase REST API...');
  
  // Test connectivity
  const testResult = await executeSQL('SELECT 1 as test').catch(e => ({ error: e.message }));
  
  if (testResult.error || testResult.status === 401 || testResult.status === 404) {
    console.log('⚠️  L\'API RPC directe n\'est pas disponible avec la clé anon.');
    console.log('');
    console.log('📌 SOLUTION : Copiez-collez le fichier SQL dans l\'Éditeur SQL Supabase :');
    console.log(`   → https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
    console.log('');
    console.log(`📂 Fichier à copier : supabase/migrations/20260812000001_initial_schema.sql`);
    return;
  }
  
  console.log('✅ Connexion réussie ! Exécution du schéma...');
  
  let success = 0;
  let errors = 0;
  
  for (const stmt of statements) {
    const result = await executeSQL(stmt).catch(e => ({ error: e.message }));
    if (result.status === 200 || result.status === 201) {
      success++;
      process.stdout.write('.');
    } else {
      errors++;
      console.log(`\n❌ Erreur: ${result.body?.substring(0, 100)}`);
    }
  }
  
  console.log(`\n\n✅ Terminé ! ${success} tables créées, ${errors} erreurs.`);
}

main();
