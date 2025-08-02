FROM node:20

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY bun.lock ./
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies using Bun
RUN bun install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app with Bun
CMD ["bun", "index.ts"]
