FROM node:18-alpine
WORKDIR /app
# Copia os arquivos de dependências
COPY package.json package-lock.json ./
# Instala as bibliotecas
RUN npm install
# Copia todo o código do frontend
COPY . .
# Expõe a porta
EXPOSE 5173
# Comando para rodar
CMD ["npm", "run", "dev"]