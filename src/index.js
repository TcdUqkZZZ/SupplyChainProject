import Web3 from "web3";
import SupplyChainArtifact from "../build/contracts/SupplyChain.json"
App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originMinerID: "0x0000000000000000000000000000000000000000",
    originMineName: null,
    originMineInformation: null,
    originMineLatitude: null,
    originMineLongitude: null,
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
        const {web3} = this;
        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SupplyChainArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
              starNotaryArtifact.abi,
              deployedNetwork.address,
            );
            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
          } catch (error) {
            console.error("Could not connect to contract or chain.");
          }
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },


    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originMinerID = $("#originMinerID").val();
        App.originMineName = $("#originMineName").val();
        App.originMineInformation = $("#originMineInformation").val();
        App.originMineLatitude = $("#originMineLatitude").val();
        App.originMineLongitude = $("#originMineLongitude").val();
        App.productPrice = $("#productPrice").val();
        App.lapidaryID = $("#lapidaryID").val();
        App.graderID = $("#graderID").val();
        App.merchantID = $("#merchantID").val();
        App.clientID = $("#clientID").val();
        App.cut = $("#cut").val();
        App.cutWeight = $("#cutWeight").val();
        App.grade = $("#grade").val();
        

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originMineName, 
            App.originMineInformation, 
            App.originMineLatitude, 
            App.originMineLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID,
            App.cut,
            App.grade,
        );
    },

    mineStone: async () => {
        App.readForm();
        const { mineStone } = this.meta.methods;
            await mineStone(App.stoneType,
                 app.baseWeight,
                0,
                App.originMineLatitude,
                App.originMinelongitude);
        
    },

    facetStone: async () => {
        App.readForm();
        const { facetStone } = this.meta.methods;
        await facetStone(App.upc, App.cut, App.cutWeight);
    },

    gradeStone: async () => {
        App.readForm();
        const { gradeStone } = this.meta.methods;

        await gradeStone(App.upc, App.grade);

    },

    sellStone: async() => {
        App.readForm();
        const {sellStone} = this.meta.methods;
        const price = document.getElementById("price").value

        await sellStone(upc, App.productPrice);
    },

    buyStone: async() => {
        const {buyStone} = this.meta.methods;

        await buyStone(upc);
        
    },

    fetchItemBuffer1: async() => {
      const{fetchItemBuffer1} = this.meta.methods;

      response = await fetchItemBuffer1(upc);
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
      const{fetchItemBuffer3} = this.meta.methods;

      response = await fetchItemBuffer2(upc);

      document.getElementById("graderId").value=`${response[0]}`;
      document.getElementById("lapidaryId").value=`${response[1]}`;
      document.getElementById("originMineLatitude").value=`${response[2]}`;
      document.getElementById("originMineLongitude").value=`${response[3]}`;
      document.getElementById("merchantId").value=`${response[4]}`;
      document.getElementById("clientId").value=`${response[5]}`;
      document.getElementById("price").value=`${response[6]}`;
      App.readForm();
    }

}

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  }
}
);
