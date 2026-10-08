const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;


mongoose.connect('mongodb://127.0.0.1:27017/meu_projeto')
.then(() => console.log('■ MongoDB conectado via Podman!'))
.catch(err => console.error('■ Erro no MongoDB:', err));


const Usuario = mongoose.model('Usuario', new mongoose.Schema({
nome: String,
email: String,
criadoEm: { type: Date, default: Date.now }
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', async (req, res) => {
try {
const usuarios = await Usuario.find();

const listaUsuarios = usuarios.map(u => `<li><strong>${u.nome}</strong> (${u.email})</li>`).join('');


let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Teste MongoDB + Mongoose</title>
<style>
body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
.container { max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: auto; }
h1 { color: #007bff; }
ul { list-style-type: none; padding: 0; }
li { padding: 10px; border-bottom: 1px solid #eee; }
form { margin-bottom: 20px; display: flex; gap: 10px; flex-direction: column; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background: #0056b3; }
</style>
</head>
<body>
<div class="container">
<h1>Cadastro de Usuários</h1>
<form action="/cadastrar" method="POST">
<input type="text" name="nome" placeholder="Nome" required />
<input type="email" name="email" placeholder="E-mail" required />
<button type="submit">Cadastrar</button>
</form>
<h2>Usuários Registrados:</h2>
<ul>
${listaUsuarios || '<li>Nenhum usuário cadastrado ainda.</li>'}
</ul>
</div>
</body>
</html>
`;
res.send(html);
} catch (err) {
res.status(500).send('Erro ao carregar usuários.');
}
});

app.post('/cadastrar', async (req, res) => {
try {
const { nome, email } = req.body;
await Usuario.create({ nome, email });
res.redirect('/'); 
} catch (err) {
res.status(500).send('Erro ao salvar usuário.');
}
});

app.listen(PORT, () => {
console.log(`Server rodando em http://localhost:${PORT}`);
});