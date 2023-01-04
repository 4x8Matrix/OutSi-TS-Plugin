import { execSync } from "child_process";

// Empty string just to make the output look nicer.
describe("", function() {
    before(() => console.log("TestsRunner :: Initializing mocha tests!"))

    it("successfully compiles with the TypeScript compiler", function() {
        execSync("pnpm build")
    });

    after(() => console.log("TestsRunner :: Mocha tests complete."))
});