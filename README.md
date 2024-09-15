<div align="center">
  <a href="https://github.com/Guxtaviko/pluto" target="blank">
    <img src="https://github.com/user-attachments/assets/a21c98d9-8d80-4fe6-8e19-69bff4683a06" alt="Pluto" />
  </a>
</div>

<p align="center"> A simple URL shortener application built with <a href="https://nestjs.com/">Nest.js</a> </p>

## Description
Pluto is a simple URL shortener application built with Nest.js. It allows users to convert long URLs into short, easy-to-share links. The application provides a robust API for managing shortened URLs.

## Setup
### Docker Compose
1. **Clone the repository**:
    ```bash
    $ git clone https://github.com/Guxtaviko/pluto.git
    $ cd pluto
    ```

2. **Create and configure the `.env` file**:
  Create a [`.env`](.env) file in the root directory and add the necessary environment variables. Refer to [`.env.example`](.env.example) for the required variables.

3. **Run Docker Compose**:
    ```bash
    $ docker-compose up --build
    ```

This will build the Docker images and start the application along with any required services (e.g., database).

### Manual Instalation:
1. **Clone the repository**:
    ```bash
    $ git clone https://github.com/Guxtaviko/pluto.git
    $ cd pluto
    ```

2. **Install dependencies**:
    ```bash
    $ yarn install
    ```

3. **Set up environment variables:**

    Create a [`.env`](.env) file in the root directory and add the necessary environment variables. Refer to [`.env.example`](.env.example) for the required variables.

4. **Generate database schema:**
    ```bash
    $ npx prisma generate
    ```
5. **Run the database migrations**:
    ```bash
    $ npx prisma migrate dev
    ```

6. **Start the aplication**
    ```bash
    # development
    $ yarn run start

    # watch mode
    $ yarn run start:dev

    # production mode
    $ yarn run start:prod
    ```

## Features

- Shorten long URLs
- Manage shortened URLs via API
- Redirect to original URLs
- Analytics for shortened URLs
