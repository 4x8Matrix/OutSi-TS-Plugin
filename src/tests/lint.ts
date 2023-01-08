import { execSync } from "child_process";

describe("", function() {
    before(() => console.log("TestsRunner :: Initializing mocha tests!"));

    it("successfully compiles with the TypeScript compiler", function() {
        execSync("pnpm lint");
    });

    after(() => console.log("TestsRunner :: Mocha tests complete."));
});