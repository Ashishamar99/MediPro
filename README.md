# MediPro

### About the project

Medipro is designed to help doctors and patients easily generate, store, and access prescriptions effectively.

## Setup

- Create a Supabase storage bucket and MySQL database.
- Create a `.env` file and add the below fields with your credentials:

```
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=
DATABASE_URL=
```

## Quickstart

### Using Docker Compose

1. Clone the repository
2. Modify the `.env` file with your Supabase and DB credentials.
3. Run the following command to start the project:
   ```
   docker-compose up
   ```

### Manual Setup

1. Clone the repository: `https://github.com/Ashishamar99/MediPro`
2. Navigate to the project directory: `cd medipro`
3. Modify the `.env` file with your Supabase and DB credentials.
4. Install dependencies using Yarn:

```
yarn install
```

5. Start the application:

```
yarn start
```
