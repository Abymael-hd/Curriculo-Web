//Imports
//le o arquivo .env e carrega variaveis secretas
require("dotenv").config();
//Importa o Express (framework de servidor).
const express = require("express");
//Biblioteca responsável por enviar e-mails.
const nodemailer = require("nodemailer");
//Permite que o front-end acesse o backend.
const cors = require("cors");

//Cria o servidor.
const app = express();
//Libera acesso de outros domínios (ex: seu site).
app.use(cors({
  origin: 'https://curriculweb.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));


//Permite receber JSON no corpo da requisição.  (Sem isso, req.body fica undefined.)
app.use(express.json());

//configurando o e-mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//criando a rota
app.post("/contato", async (req, res) => {
    //Pega os dados enviados pelo front
    const { nome, email, mensagem } = req.body;

    //Valida os dados
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    //Envia o e-mail
    try {
        await transporter.sendMail({
        from: `"Currículo Web" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email, // 👈 MUITO IMPORTANTE
        subject: "Contato - Currículo Web",
        text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
});


        //mensagens caso envie ou não o e-mail
        res.status(200).json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao enviar email:", err);
        res.status(500).json({ erro: "Erro ao enviar e-mail" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta 3000");
});
