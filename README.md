# Mottu Storage: Gestão Inteligente de Pátio com Visão Computacional

## ▶️ Vídeo de Apresentação: [Link do YouTube](https://youtu.be/scofl92qDTw) 

## 🎯 Visão Geral do Projeto

O **Mottu Storage** é uma solução mobile e IoT desenvolvida para otimizar a gestão e o controle de veículos (motos) em pátios de armazenamento. Utilizando a tecnologia **React Native**, o aplicativo oferece uma interface fluida e nativa para a equipe de campo, enquanto incorpora recursos avançados de **Visão Computacional** (através do scanner de câmera) para automatizar a identificação e a localização dos ativos.

Este projeto atende a dois grandes desafios: a necessidade de uma aplicação mobile robusta para operações diárias e a integração com um sistema de IoT/Visão Computacional para um fluxo de dados completo e em tempo real.

## ✨ Funcionalidades Principais

| Categoria | Funcionalidade | Descrição |
| --- | --- | --- |
| **Gestão de Ativos** | Cadastro e Edição | Telas completas para o cadastro e a edição de veículos e localizações no pátio. |
| **Visão Computacional** | Scanner de QR Code/Código de Barras | Utiliza a câmera do dispositivo como um scanner de visão computacional para leitura rápida e precisa de códigos de identificação (QR Code/Código de Barras) de veículos e locais. |
| **Rastreamento** | Localização em Tempo Real | Permite a consulta e a visualização da localização exata das motos no pátio, integrando-se ao fluxo de dados de IoT. |
| **Operações** | Recebimento e Consulta | Fluxos de trabalho dedicados para o recebimento de novos veículos e a consulta de histórico. |
| **Notificações** | Push Notifications | Implementação de notificações push para alertas em tempo real (ex: nova moto, lembrete, atualização). |
| **Acessibilidade** | Internacionalização (i18n) | Suporte completo aos idiomas **Português** e **Espanhol**. |
| **Experiência** | Temas (Light/Dark Mode) | Suporte a temas claro e escuro, garantindo conforto visual em diferentes ambientes. |

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Uso |
| --- | --- | --- |
| **Frontend** | React Native (TypeScript) | Desenvolvimento da aplicação mobile nativa. |
| **Backend/DB** | Firebase (Autenticação, Firestore, etc.) | Utilizado para serviços de backend, autenticação e banco de dados em tempo real. |
| **Visão Computacional** | Câmera/Scanner de Barcode | Módulo de câmera para leitura de códigos (Visão Computacional) para identificação de ativos. |
| **Integração** | API RESTful | Comunicação com a API de backend (Java) para operações CRUD completas. |
| **DevOps** | GitHub Actions | Automação do processo de CI/CD. |
| **Distribuição** | Firebase App Distribution | Publicação e distribuição da versão de testes do aplicativo. |

## 🚀 Deploy Contínuo (CI/CD)

O projeto implementa um fluxo de **Integração Contínua e Entrega Contínua (CI/CD)** robusto, utilizando o **GitHub Actions** para automatizar o processo de build e distribuição.

### GitHub Actions

O pipeline de CI/CD é configurado para:

1. **Build Automático:** A cada `push` para a branch principal, o GitHub Actions dispara o processo de build do aplicativo React Native.

1. **Testes:** Execução de testes automatizados para garantir a qualidade do código.

1. **Distribuição:** Após um build bem-sucedido, o artefato (APK) é automaticamente enviado para o **Firebase App Distribution**.

### Firebase App Distribution

O Firebase é o pilar da distribuição de testes do aplicativo.

- **Publicação:** A versão mais recente do aplicativo é publicada automaticamente no Firebase App Distribution, garantindo que os *testers* tenham acesso imediato às novas funcionalidades.

- **Rastreabilidade:** A tela "Sobre o App" exibe o **hash do commit** de referência, garantindo que a versão instalada pelo *tester* corresponda exatamente ao código-fonte no repositório.

## 💻 Estrutura de Pastas

A arquitetura do código segue o padrão de separação de responsabilidades, promovendo um código limpo, legível e de fácil manutenção.

```
MottuStorageRN/
├── android/              # Arquivos nativos Android
├── ios/                  # Arquivos nativos iOS
├── src/
│   ├── components/       # Componentes de UI reutilizáveis (ex: BarcodeScanner.tsx)
│   ├── config/           # Configurações globais (ex: firebase.ts)
│   ├── context/          # Contextos globais (ex: AuthContext.tsx, ThemeContext.tsx)
│   ├── screens/          # Telas principais da aplicação (ex: Home.tsx, Login.tsx, Cadastro.tsx)
│   ├── services/         # Camada de serviços e lógica de negócio (ex: api.ts, notifications.ts)
│   └── styles/           # Definições de tema e estilos globais (ex: theme.ts)
├── App.tsx               # Componente raiz da aplicação
├── package.json          # Dependências e scripts do projeto
└── tsconfig.json         # Configurações do TypeScript
```

## 🔄 Fluxo de Trabalho

### 1. Cadastro

### Veículo
- **Cadastra veículo** → Gera QR Code

### Localização (Quando necessário) 
- **Cadastra localização** → Gera QR Code

### 2. Recebimento

- **Escaneia QR veículo** → Identifica veículo
- **Escaneia QR localização** → Identifica posição
- **Associa veículo à localização**

### 3. Consulta

- **Consulta em qual posição o veículo está armazenado**

### 4. Histórico

- **Consulta histórico de veículos armazenados**
- **Edita ou Exclui veículos armazenados**

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js (versão recomendada)

- Yarn ou npm

- React Native Environment (Android Studio e/ou Xcode)

- Ruby e Bundler (para iOS)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ViniciusLeopoldino/MottuStorageRN.git
    cd MottuStorageRN
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    # ou
    npm install
    ```

3.  **Configuração iOS (Opcional):**
    ```bash
    # Instala o CocoaPods
    bundle install
    cd ios
    bundle exec pod install
    cd ..
    ```

### Execução

1.  **Inicie o Metro Bundler:**
    ```bash
    yarn start
    # ou
    npm start
    ```

2.  **Execute a aplicação:**

    **Android:**
    ```bash
    yarn android
    # ou
    npm run android
    ```

    **iOS:**
    ```bash
    yarn ios
    # ou
    npm run ios
    ```

## 👥 Equipe

| Nome | RM | GitHub |
| --- | --- | --- |
| Vinicius Leopoldino de Oliveira | 557047 | [Link do GitHub](https://github.com/ViniciusLeopoldino) |
| Pablo Lopes Doria de Andrade | 556834 | [Link do GitHub](https://github.com/Pablo0703)  |

