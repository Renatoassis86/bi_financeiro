const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
    const email = 'renato.consultoria@cidadeviva.org';
    const password = 'renatoadmin2026';

    console.log(`Configurando administrador: ${email}`);

    // Lista usuários para achar o ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        console.error('Erro ao listar usuários:', listError.message);
        return;
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log('Usuário encontrado. Atualizando senha...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: password,
            user_metadata: { role: 'ADMIN', nome: 'Renato Assis (Admin)' }
        });
        if (updateError) console.error('Erro ao atualizar:', updateError.message);
        else console.log('✅ Senha e Metadados atualizados com sucesso!');
    } else {
        console.log('Usuário não encontrado. Criando novo...');
        const { error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'ADMIN', nome: 'Renato Assis (Admin)' }
        });
        if (createError) console.error('Erro ao criar:', createError.message);
        else console.log('✅ Administrador criado com sucesso!');
    }
}

run();
