# IoT Payment System Backend
UTS IF4051 IoT System Development (Backend)

## How to Run
1. Clone the repo
```bash
git clone https://github.com/farrel-a/iot-payment-backend.git
```

2. Install dependencies
```bash
cd iot-payment-backend
npm install
```

3. Create `.env` file from `.env.template`
```bash
cp .env.template .env
# then fill all the required environment variables in .env
```

4. Fill MySQL database from script at `/sql/init.sql`

5. Run the app
```bash
npm start
```