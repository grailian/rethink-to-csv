const { getFields } = require('../../lib/rethink-to-csv');

function tests() {
    describe('Helper Function', () => {
        beforeEach((done) => {
            // Before each test we empty the database
            done();
        });
        describe('getFields', () => {
            it('should return a unique list of all possible fields', (done) => {
                const actual = getFields([{
                    name: 'Jim'
                }, {
                    age: 45
                }, {
                    price: 50
                }]);
                const expected = ['name', 'age', 'price'];
                expect(actual).to.eql(expected);
                done();
            });
        });
    });
}

// Ensure we are running in test environment since we are writing to the database
if (process.env.NODE_ENV === 'test'
    && process.env.RETHINK_HOST === 'localhost'
    && process.env.RETHINK_DB_NAME === 'test') {
    tests();
}
