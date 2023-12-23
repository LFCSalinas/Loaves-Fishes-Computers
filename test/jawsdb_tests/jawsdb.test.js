const dbService = require("../../server/repository/queries.js")

// Test: findIdByEmail | return id of row with matching unique email
test('SELECT id from user', async () => {
    const result = await dbService.findIdByEmail("rayivh@gmail.com");
    expect(result).toBe(1);
});



