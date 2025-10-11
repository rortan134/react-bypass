import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["**/*.test.?(c|m)[jt]s?(x)"],
    },
});
