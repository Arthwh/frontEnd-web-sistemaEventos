# Estágio 1: Build (Construção)
FROM node:20-alpine AS build

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Recebe a variável de ambiente NA HORA DO BUILD
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Gera a pasta 'dist' otimizada
RUN npm run build

# Estágio 2: Servidor (Nginx)
FROM nginx:alpine

# Copia o build gerado acima para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# CONFIGURAÇÃO CRÍTICA PARA REACT ROUTER:
# Isso faz com que qualquer rota (ex: /login) seja redirecionada para o index.html
# Se não tiver isso, ao dar F5 na página, vai dar erro 404.
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]