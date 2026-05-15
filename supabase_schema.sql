-- 1. Tabela de Usuários (Acessos Puros)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL, -- Nota: Para um ambiente de produção real, as senhas devem ser criptografadas (Hash). Como é um projeto direto de usuário/senha simples para MVP, mantemos como texto.
  role TEXT DEFAULT 'aluna',
  nome TEXT,
  objetivo TEXT,
  plano TEXT,
  status TEXT DEFAULT 'Ativo',
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inserir usuário Admin Padrão
INSERT INTO usuarios (usuario, senha, role, nome) 
VALUES ('admin', 'admin', 'admin', 'Rayana Maria')
ON CONFLICT (usuario) DO NOTHING;

-- 2. Tabela de Planilhas de Treino (Geradas pela IA/Admin)
CREATE TABLE IF NOT EXISTS planilhas_treino (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluna_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  foco TEXT, -- Ex: Hipertrofia, Emagrecimento
  duracao_semanas INTEGER DEFAULT 4,
  conteudo_treino JSONB, -- Aqui a IA vai salvar o treino completo estruturado em JSON (dias da semana, exercícios, séries, reps)
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ativo BOOLEAN DEFAULT true
);

-- 3. Tabela de Atividades / Check-ins
CREATE TABLE IF NOT EXISTS atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluna_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- Ex: 'check-in', 'treino_concluido', 'peso_atualizado'
  detalhes JSONB, -- Detalhes extras como peso atual, humor, fotos (URLs)
  data_atividade TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Configuração de Segurança Básica (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE planilhas_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Exemplos abertos para facilitar o MVP, mas podem ser travados)
CREATE POLICY "Permitir leitura pública" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública" ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura pública planilhas" ON planilhas_treino FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública planilhas" ON planilhas_treino FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura pública atividades" ON atividades FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública atividades" ON atividades FOR INSERT WITH CHECK (true);
