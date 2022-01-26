App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    minerID: "0x0000000000000000000000000000000000000000",
    mineLatitude: null,
    mineLongitude: null,
    productNotes: null,
    productPrice: 0,
    cut: null,
    baseWeight: null,
    cutWeight: null,
    grade: null,
    stoneType:null,
    lapidaryID: "0x0000000000000000000000000000000000000000",
    graderID: "0x0000000000000000000000000000000000000000",
    merchantID: "0x0000000000000000000000000000000000000000",
    clientID: "0x0000000000000000000000000000000000000000",


    init: async function () {
        App.readForm();
        return await App.initWeb3();
    },

    readForm: () => {
      App.sku = $("#sku").val();
      App.upc = $("#upc").val();
      App.ownerID = $("#ownerId").val();
      App.minerID = $("#minerId").val();
      App.mineLatitude = $("#mineLatitude").val();
      App.mineLongitude = $("#mineLongitude").val();
      App.productPrice = $("#productPrice").val();
      App.lapidaryID = $("#lapidaryId").val();
      App.graderID = $("#graderId").val();
      App.merchantID = $("#merchantId").val();
      App.clientID = $("#clientId").val();
      App.cut = $("#cut").val();
      App.baseWeight = $("#minerWeight").val();
      App.cutWeight = $("#cutWeight").val();
      App.grade = $("#grade").val();
      App.stoneType = $("#stoneType").val();
      
  
      console.log(
          App.sku,
          App.upc,
          App.ownerID, 
          App.minerID, 
          App.mineLatitude, 
          App.mineLongitude, 
          App.productNotes, 
          App.productPrice, 
          App.distributorID, 
          App.retailerID, 
          App.consumerID,
          App.cut,
          App.grade,
          App.stoneType,
      );
  },

    initWeb3: async () => {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
      }
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("access denied");
      }

      App.getMetamaskAccountID();
      return App.initSupplyChain();
    },

    getMetamaskAccountID: () => {
      web3 = new Web3(App.web3Provider);

      web3.eth.getAccounts((err,res) => {
        if (err) {
          console.error(`Error: ${err}`);
          return;
        }
        console.log(`getMetamaskID: ${res}`);

        App.metamaskAccountID = res[0];
      })
    },

    initSupplyChain: () => {
      var jsonSupplyChain = '../build/contracts/SupplyChain.json';
      $.getJSON(jsonSupplyChain, function(data) {
        console.log(`data: ${data}`);
        let SupplyChainArtifact = data;
        App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
        App.contracts.SupplyChain.setProvider(App.web3Provider);
        App.fetchItemBuffer1();
        App.fetchItemBuffer2();
        App.fetchEvents();
      });
      return App.bindEvents();
    },

    bindEvents: function() {
      $(document).on('click', App.handleButtonClick);
  },

  handleButtonClick: async function(event) {
    event.preventDefault();
    App.readForm();
    App.getMetamaskAccountID();

    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    switch(processId) {
        case 1:
            return await App.mineStone(event);
            break;
        case 2:
            return await App.facetStone(event);
            break;
        case 3:
            return await App.gradeStone(event);
            break;
        case 4:
            return await App.sellStone(event);
            break;
        case 5:
            return await App.buyStone(event);
            break;
        case 6:
            return await App.fetchItemBuffer1(event);
            break;
        case 7:
            return await App.fetchItemBuffer2(event);
            break;
        }
},


    mineStone: async (event) => {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      let instance = await App.contracts.SupplyChain.deployed();
       await instance.mineStone(App.stoneType,
                 App.baseWeight,
                0,
                App.mineLatitude,
                App.mineLongitude,
                {from: `${App.minerID}`});

      
        
    },

    facetStone: async () => {
      let instance = await App.contracts.SupplyChain.deployed();

        
          await instance.facetStone(App.upc, App.cut, App.cutWeight,
            {from: `${App.lapidaryID}`});
    },

    gradeStone: async () => {
      let instance = await App.contracts.SupplyChain.deployed();

        App.readForm();
        await instance.gradeStone(App.upc, App.grade,{from: `${App.graderID}`});

    },

    sellStone: async() => {
      let instance = await App.contracts.SupplyChain.deployed();

        App.readForm();

        await instance.sellStone(App.upc, App.productPrice, {from: `${App.merchantID}`});
    },

    buyStone: async() => {
      let instance = await App.contracts.SupplyChain.deployed();

        await instance.buyStone(App.upc, {from: `${App.clientID}`});
        
    },

    fetchItemBuffer1: async() => {
      let instance = await App.contracts.SupplyChain.deployed();


      response = await instance.fetchItemBuffer1(App.upc);
      document.getElementById("sku").value=`${response[0]}`;
      document.getElementById("stoneType").value=`${response[2]}`;
      document.getElementById("grade").value=`${response[3]}`;
      document.getElementById("cut").value=`${response[4]}`;
      document.getElementById("stoneWeight").value=`${response[5]}`;
      document.getElementById("ownerId").value=`${response[6]}`;
      document.getElementById("minerId").value=`${response[7]}`;
      App.readForm();
    },

    fetchItemBuffer2: async() => {
      let instance = await App.contracts.SupplyChain.deployed();

      response = await instance.fetchItemBuffer2(App.upc);

      document.getElementById("graderId").value=`${response[0]}`;
      document.getElementById("lapidaryId").value=`${response[1]}`;
      document.getElementById("mineLatitude").value=`${response[2]}`;
      document.getElementById("mineLongitude").value=`${response[3]}`;
      document.getElementById("merchantId").value=`${response[4]}`;
      document.getElementById("clientId").value=`${response[5]}`;
      document.getElementById("productPrice").value=`${response[6]}`;
      App.readForm();
    },

    fetchEvents: function () {
      if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
          App.contracts.SupplyChain.currentProvider.sendAsync = function () {
              return App.contracts.SupplyChain.currentProvider.send.apply(
              App.contracts.SupplyChain.currentProvider,
                  arguments
            );
          };
      }

      App.contracts.SupplyChain.deployed().then(function(instance) {
      var events = instance.allEvents(function(err, log){
        if (!err)
          $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
      });
      }).catch(function(err) {
        console.log(err.message);
      });
      
  }
};
$(function () {
  $(window).load(function () {
      App.init();
  });
});


