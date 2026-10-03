import { createClient } from "redis";

const func = async () => {
    const client = createClient({
        url: "redis://localhost:6379"
    });

    client.on("error", (err) => {
        console.error("Redis Error:", err);
    });

    await client.connect();

    console.log("Redis connected successfully");

    return client;
};

export default func();