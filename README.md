# SPM-G8-T3 Skill Based Role Portal (SBRP)

**Deployed URL:**<br>
https://spm-role-portal-eight.vercel.app

## Folder Structure
- BE (A Copy of the Backend services for SBRP)
  - API Documentation (A Copy of the API Documentation for SBRP)
  - dbinitscripts (Scripts used to populate MySQL Database with dummy data)
  - unit-tests (Unit Tests for the Backend Services)
  - [individual services] (Individual Services for the Backend)

- sbrp-frontend (Full Stack NextJS-Flask Application hosted on Vercel)

## Getting Started

### Prerequisites
- NodeJS 18.* minimum
- Python 3.9 minimum
- pnpm 8.* minimum
- MySQL 8.0.31 minimum
  - MySQL has to be running and accessible 

### Run Locally
1. Clone the repository
2. Navigate to the `sbrp-frontend` folder
3. add .env file with the following content in the root directory
```
dbURL='mysql+mysqldb://<USERNAME>:<PASSWORD>@<HOSTNAME>:<PORT>/<DATABASE_NAME>'
```
4. Run `pnpm install` or `npm install` to install all dependencies
5. Run `npm run dev` to start the development server


## Team Members
<table border>
  <tr>
    <td align="center"><b>Nicholas Goh Bang Rui</b></td>
    <td align="center"><b>Daniel Lai En Xian</b></td>
    <td align="center"><b>Nicklaus Chiok Tek Song</b></td>
    <td align="center"><b>Liao Jia Xiong</b></td>
    <td align="center"><b>Wei Yi Fan</b></td>
</table>

