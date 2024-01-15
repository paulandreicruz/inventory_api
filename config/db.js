import pkg from "pg";

const { Pool } = pkg;

const connectionString =
  "postgresql://dei:1mYNFJzpc-303MpbKyxWvw@inventory-5882.6xw.aws-ap-southeast-1.cockroachlabs.cloud:26257/gradingDB?sslmode=verify-full";

const pool = new Pool({
  connectionString,
});

const query = async (text, values) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, values);
    return result.rows;
  } finally {
    client.release();
  }
};

export default query;
