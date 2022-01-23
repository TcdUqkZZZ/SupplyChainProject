var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function(accounts) {
    var sku  = 1;
    var state = 0;
    const stoneType = "diamond";
    const grade = "perfect";
    const cut = "brilliant";
    const weight = 1;
    var upc = 1;
    const ownerId = accounts[0];
    const minerId = accounts[1];
    const graderId = accounts[2];
    const lapidaryId = accounts[3];
    const mineLatitude = "not really";
    const mineLongitude = "A geographer";
    var productId = sku + upc;
    const merchantId = accounts[4];
    const clientId = accounts[5];
    const price = 1000;

});

it("allows miner to mine stones", async() => {
    const supplyChain = await SupplyChain.deployed();

    var eventEmitted = false;

    var event = supplyChain.Mined();

    await event.watch((err, res) => {
        eventEmitted = true;
    })

    await supplyChain.addMiner(minerId);

    await supplyChain.mineStone("diamond", 1, "not really", "a geographer");

    const resultBuffer = await supplyChain.fetchItemBuffer.call(upc);

    assert.equal(resultBuffer[0], sku, 'invalid sku' );
    assert.equal(resultBuffer[1], state, 'invalid state');
    assert.equal(resultBuffer[2], stoneType, 'invalid stone type' );
    assert.equal(resultBuffer[5], weight, 'invalid weight');
    assert.equal(resultBuffer[6], upc, 'invalid upc');
})