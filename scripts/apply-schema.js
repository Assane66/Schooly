const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Try pooler host string first, fallback to direct
const connectionStrings = [
  'postgresql://postgres.ljvnnpwwmhzdctvflsxb:OeTeIAvPcdks8wXt@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.ljvnnpwwmhzdctvflsxb:OeTeIAvPcdks8wXt@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres:OeTeIAvPcdks8wXt@db.ljvnnpwwmhzdctvflsxb.supabase.co:5432/postgres'
];

async function migrate() {
  let connected = false;
  
  for (const connStr of connectionStrings) {
    console.log(`Tentative de connexion à ${connStr.split('@')[1]}...`);
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✅ Connecté avec succès à Supabase PostgreSQL !');
      connected = true;

      const sqlPath = path.join(__dirname, '../supabase/schema.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');

      console.log('Exécution du schéma SQL (Tables, Multi-tenancy RLS)...');
      await client.query(sql);

      console.log('🎉 SCHÉMA DE BASE DE DONNÉES CRÉÉ AVEC SUCCÈS DANS SUPABASE !');
      await client.end();
      break;
    } catch (err) {
      console.error(`❌ Échec sur cet hôte : ${err.message}`);
      await client.end().catch(() => {});
    }
  }

  if (!connected) {
    console.log('\n💡 Conseil : Si le port direct est bloqué par le pare-feu local, vous pouvez coller le contenu de supabase/schema.sql directement dans l\'Éditeur SQL de Supabase (SQL Editor > New Query > Run) !');
  }
}

migrate();
