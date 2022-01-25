const truffleAssert = require('truffle-assertions');
var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function(accounts) {
    var sku  = 1;
    var state = 0;
    const stoneType = "diamond";
    const grade = "perfect";
    const cut = "brilliant";
    const weightInitial = 2;
    const weightAfterCut = 1
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
it("allows miner to mine stones", async() => {
    let supplyChain = await SupplyChain.deployed();
    await supplyChain.addMiner(minerId);
    let tx = await supplyChain
    .mineStone("diamond", 2, 1000, "not really", "A geographer", {from: minerId});

     resultBuffer1 = await supplyChain.fetchItemBuffer1.call(upc);
     resultBuffer2 = await supplyChain.fetchItemBuffer2.call(upc);

    assert.equal(resultBuffer1[0], sku, 'invalid sku' );
    assert.equal(resultBuffer1[1], state, 'invalid state');
    assert.equal(resultBuffer1[5], weightInitial, 'invalid weight');
    assert.equal(resultBuffer2[2], mineLatitude, 'invalid latitude');
    assert.equal(resultBuffer2[3], mineLongitude, 'invalid longitude');
    assert.equal(resultBuffer1[2], stoneType, 'invalid stone type' );
    assert.equal(resultBuffer1[7], minerId, 'invalid miner id');
    truffleAssert.eventEmitted(tx, 'Mined');
})

it("allows Lapidary to facet stone", async() => {
    let supplyChain = await SupplyChain.deployed();

    let tx =await supplyChain.addLapidary(lapidaryId);
    truffleAssert.eventEmitted(tx, 'lapidaryAdded')

    tx = await supplyChain.facetStone(upc, "brilliant", 1, {from: lapidaryId});
    truffleAssert.eventEmitted(tx, 'Faceted');

    resultBuffer1 = await supplyChain.fetchItemBuffer1.call(upc);
    resultBuffer2 = await supplyChain.fetchItemBuffer2.call(upc);
    assert.equal(resultBuffer1[5], weightAfterCut, 'wrong weight');
    assert.equal(resultBuffer1[4], cut, "wrong cut");
    assert.equal(resultBuffer2[1], lapidaryId, "wrong lapidary id")
    assert.equal(resultBuffer1[1], 1, 'invalid state');
})

it("allows Grader to grade the stone", async() => {
    let supplyChain = await SupplyChain.deployed();

    let tx = await supplyChain.addGrader(graderId);
    truffleAssert.eventEmitted(tx, 'graderAdded');
    tx = await supplyChain.gradeStone(upc,"perfect", {from: graderId});

    truffleAssert.eventEmitted(tx, 'Graded');

    resultBuffer1 = await supplyChain.fetchItemBuffer1.call(upc);
    resultBuffer2 = await supplyChain.fetchItemBuffer2.call(upc);

    assert.equal(resultBuffer1[1], 2, 'invalid state');
    assert.equal(resultBuffer2[0], graderId, 'wrong lapidary id');
    assert.equal(resultBuffer1[3], grade, "wrong grade");
})

it("allows Merchant to put stone up for sale", async() => {
    let supplyChain = await SupplyChain.deployed();

    let tx = await supplyChain.addMerchant(merchantId);
    truffleAssert.eventEmitted(tx, 'merchantAdded');

    tx = await supplyChain.sellStone(upc, price, {from:merchantId});
    truffleAssert.eventEmitted(tx, 'ForSale');

    resultBuffer1 = await supplyChain.fetchItemBuffer1.call(upc);
    resultBuffer2 = await supplyChain.fetchItemBuffer2.call(upc);

    assert.equal(resultBuffer1[1], 3, 'invalid state');
    assert.equal(resultBuffer2[4], merchantId, 'invalid merchant id');
    assert.equal(resultBuffer2[6], price, 'invalid price');


})

it("allows Client to buy a stone", async() => {
    let supplyChain = await SupplyChain.deployed();

    let tx = await supplyChain.addClient(clientId);
    truffleAssert.eventEmitted(tx, 'clientAdded');

    tx = await supplyChain.buyStone(upc, {from: clientId, value: price});
    truffleAssert.eventEmitted(tx, 'Sold');

    resultBuffer1 = await supplyChain.fetchItemBuffer1.call(upc);
    resultBuffer2 = await supplyChain.fetchItemBuffer2.call(upc);


    assert.equal(resultBuffer1[6], clientId, "invalid ownerId");
    assert.equal(resultBuffer2[5], clientId, "invalid clientId");

})

});