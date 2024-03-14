const dbService = require("../../../services/repository/dbService.js")

// Test: findIdByEmail | return id of row with matching unique email
test('findUserById', async () => {
    const result = await dbService.findUserById(1);
    console.log(`Expected: rayivh@gmail.com, Actual: ${result.email}`);
    expect(result.email).toBe("rayivh@gmail.com");
});

// Test findUserByEmail ()
test('findUserByEmail', async () => {
    const result = await dbService.findUserByEmail("rayivh@gmail.com");
    console.log(`Expected: 1, Actual: ${result.id}`);
    expect(result.id).toBe(1);
});

// Test findAllUsersNotDeleted ()
test('findAllUsersNotDeleted', async () => {
    const rows = await dbService.findAllUsersNotDeleted();
});

// Test addUser
test('addUser', async () => {
    const resultId = await dbService.addUser("test_f", "test_l", "test@test.test", "hashedPwd", "token?", new Date().toISOString().split('T')[0]);
    console.log(`Expected: 2, Actual: ${resultId}`);
    expect(resultId).toBe(2);

    // expect(typeof resultId).toBe('number');
    // expect(resultId).toBeGreaterThan(0);
});

// Test activateUser (by email)
test('activateUser', async () => {
    await dbService.activateUser("rayivh@gmail.com");
});


// Test deleteAllUsers
test('deleteAllUsers', async () => {
    //await dbService.deleteAllUsers();
});


// Test form field setting
test('setPDF', async () =>{
    await dbService.setUserDataById({forms:"test"},1)
});
