var Matis = require("../index");

describe('tools.Nop.spec', function() {
    var tool = Matis.tools.Nop();
    
    it('should provide `any` as only input', function() {
        expect(tool.definition.input).toEqual(['any']);
    });
    it('should provide `any` as only output', function() {
        expect(tool.definition.output).toEqual(['any']);
    });
    
    ['Yo!', 'Man'].forEach(function (testcase) {
        it('should forward `' + testcase  + '`.', function(done) {
            tool.exec({any: testcase}, function(outputs) {
                expect(outputs.any).toBe(testcase);
                done();
            });
        });
    });
});
