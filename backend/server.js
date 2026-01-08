// Carrega variáveis de ambiente (.env ou Render)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// CORS – permite apenas seu frontend
app.use(cors({
  origin: "https://curriculweb.netlify.app",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

// Permite JSON no body
app.use(express.json());

// Inicializa Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rota de contato
app.post("/contato", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  try {
    await resend.emails.send({
      from: "Currículo Web <onboarding@resend.dev>",
      to: ["abymael202@gmail.com"], 
      reply_to: email,
      subject: "Contato - Currículo Web",
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `
    });

    res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ erro: "Erro ao enviar e-mail" });
  }
});

// Porta (Render define automaticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
