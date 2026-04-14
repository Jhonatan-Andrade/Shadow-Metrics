### 📌 Visão Geral
O **Shadow Metrics** é uma aplicação voltada para monitoramento utilizando o Zabbix como backend, com uma interface moderna construída em React.

A aplicação permite consumir métricas do Zabbix através de sua API, oferecendo uma camada visual amigável para acompanhamento de dados.

### 🏗️ Arquitetura do Projeto

O projeto é dividido em dois principais componentes:

#### 🔹 Frontend
- Desenvolvido com **React** utilizando **Vite**
- Estilização feita com **Styled Components**
- Responsável por consumir a API do Zabbix e exibir as métricas

#### 🔹 Backend (Infraestrutura)
- Gerenciado via **Docker Compose**
- Serviços utilizados:
  - PostgreSQL (Banco de dados)
  - Zabbix Server
  - Zabbix Web



#### ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Docker
- Docker Compose
- Node.js (versão 18+ recomendada)
- Git



#### 🚀 Instalação e Execução

##### 1. Clonar o repositório

```bash
git clone https://github.com/Jhonatan-Andrade/Shadow-Metrics.git
cd Shadow-Metrics
```

---

##### 2. Subir os serviços do Zabbix

O projeto utiliza Docker para iniciar os serviços necessários.

```bash
docker-compose up -d
```

Isso irá iniciar:
- Banco de dados PostgreSQL
- Zabbix Server
- Zabbix Web

---

##### 3. Acessar o Zabbix Web

Após subir os containers, acesse o painel web do Zabbix:

```
http://localhost:8080
```

> As credenciais padrão geralmente são:
> - Usuário: Admin
> - Senha: zabbix

---

##### 4. Gerar API Key no Zabbix

Para integrar com a aplicação, é necessário gerar uma API Key:

1. Acesse o Zabbix Web
2. Vá em **User Settings**
3. Navegue até **API Tokens**
4. Crie um novo token

---

##### 5. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend com as seguintes variáveis:

```env
VITE_ZABBIX_API_URL=http://localhost:8080/api_jsonrpc.php
VITE_ZABBIX_API_TOKEN=SEU_TOKEN_AQUI
```

---

##### 6. Instalar dependências do frontend

```bash
npm install
```

---

##### 7. Executar o projeto React

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

### 🔗 Integração com Zabbix

A aplicação consome dados diretamente da API do Zabbix utilizando o token gerado.

Principais pontos:
- Comunicação via JSON-RPC
- Autenticação por API Token
- Consumo de métricas, hosts e triggers



### 📁 Estrutura do Projeto (Sugestão)

```
Shadow-Metrics/
├── src/
│   ├── components/
│   ├── services/
│   └── styles/
├── docker-compose.yml
└── README.md
```

### 🛠️ Tecnologias Utilizadas

- React
- Vite
- Styled Components
- Docker
- Zabbix
- PostgreSQL

###  ⚠️ Observações

- Certifique-se de que as portas do Docker não estão em uso
- O tempo de inicialização do Zabbix pode levar alguns minutos
- Verifique os logs com:

```bash
docker-compose logs -f
```

### 📄 Licença

Este projeto está sob a licença MIT.
