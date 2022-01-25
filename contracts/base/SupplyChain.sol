pragma solidity >=0.8.0;
import "../accesscontrol/MinerRole.sol" as Miner;
import "../accesscontrol/GraderRole.sol" as Grader;
import "../accesscontrol/MerchantRole.sol" as Merchant;
import "../accesscontrol/LapidaryRole.sol" as Lapidary;
import "../accesscontrol/ClientRole.sol" as Client;
import "../core/Ownable.sol" as Ownable;
contract SupplyChain is Ownable.Ownable,
                    Miner.MinerRole ,
                     Grader.GraderRole,
                     Merchant.MerchantRole,
                     Lapidary.LapidaryRole,
                     Client.ClientRole
                     
    {

    //address owner;
    uint _upc;
    uint _sku;
    
    mapping (uint => Stone) stones;

    mapping (uint => string[]) stonesHistory;

    enum State
    {
        Rough,
        Faceted,
        Graded,
        ForSale,
        Sold
    }

    struct Stone{
        uint sku;
        State state;
        string stoneType;
        string grade;
        string cut;
        uint weight;
        uint upc;
        address ownerId;
        address minerId;
        address graderId;
        address lapidaryId;
        string mineLatitude;
        string mineLongitude;
        address merchantId;
        address clientId;
        uint price;
    }

    event Mined(uint upc);
    event Faceted(uint upc);
    event Graded(uint upc);
    event ForSale(uint upc);
    event Sold(uint upc);

    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier paidEnough(uint _price){
        require (msg.value >= _price);
        _;
    }

    modifier checkValue(uint __upc) {
        _;
        uint _price = stones[__upc].price;
        uint amountToReturn = msg.value - _price;
        address payable addressToReturn = payable(stones[__upc].clientId);
        addressToReturn.transfer(amountToReturn);
    }

    modifier rough(uint __upc) {
        require(stones[__upc].state == State.Rough);
        _;
    }

     modifier faceted(uint __upc) {
        require(stones[__upc].state == State.Faceted);
        _;
    }

     modifier graded(uint __upc) {
        require(stones[__upc].state == State.Graded);
        _;
    }

     modifier forSale(uint __upc) {
        require(stones[__upc].state == State.ForSale);
        _;
     }
     modifier sold(uint __upc) {
        require(stones[__upc].state == State.Sold);
        _;
    }

    constructor() payable Ownable.Ownable() 
                            Miner.MinerRole()
                            Merchant.MerchantRole()
                            Grader.GraderRole()
                            Lapidary.LapidaryRole()
                            Client.ClientRole(){
        _sku = 1;
        _upc = 1;
        }
    


       function mineStone(string memory _type,
        uint _weight,
         uint _price, 
        string memory _latitude,
        string memory _longitude) public onlyMiner {

            Stone memory newStone;
            newStone.stoneType = _type;
            newStone.state = State.Rough;
            newStone.weight = _weight;
            newStone.price = _price;
            newStone.sku = _sku;
            _sku++;
            newStone.upc = _upc;
            _upc++;
            newStone.minerId = msg.sender;
            newStone.mineLatitude = _latitude;
            newStone.mineLongitude = _longitude;
            stones[newStone.upc] = newStone;
            emit Mined(newStone.upc);
        }
           

        function facetStone(uint __upc,
        string memory _cut,
        uint cutWeight) public onlyLapidary rough(_upc){
            require(cutWeight <= stones[__upc].weight);
            Stone memory cutStone = stones[__upc];
            cutStone.cut = _cut;
            cutStone.weight = cutWeight;
            cutStone.state = State.Faceted;
            cutStone.lapidaryId = msg.sender;
            stones[cutStone.upc] = cutStone;
            emit Faceted(__upc);
        }

        function gradeStone(uint __upc,
        string memory _grade) public onlyGrader faceted(__upc) {
            Stone memory gradedStone = stones[__upc];
            gradedStone.grade = _grade;
            gradedStone.state = State.Graded;
            gradedStone.graderId = msg.sender;
            stones[gradedStone.upc] = gradedStone;
            emit Graded(__upc);
        }

        function sellStone(uint __upc, uint _price) public
        onlyMerchant graded(__upc){
            Stone memory stoneForSale = stones[__upc];
            stoneForSale.price = _price;
            stoneForSale.state = State.ForSale;
            stoneForSale.merchantId = msg.sender;
            stones[stoneForSale.upc] = stoneForSale;
            emit ForSale(__upc);
        }

        function buyStone(uint __upc) public payable forSale(__upc) 
        paidEnough(stones[__upc].price)
        checkValue(__upc)
        onlyClient {
            Stone memory soldStone = stones[__upc];
            soldStone.ownerId = msg.sender;
            soldStone.state = State.Sold;
            soldStone.clientId = msg.sender;
            stones[soldStone.upc] = soldStone;
            emit Sold(__upc);
        }

         function fetchItemBuffer1(uint __upc) public view returns
    (
        uint sku,
        State state,
        string memory stoneType,
        string memory grade,
        string memory cut,
        uint weight,
        address ownerId,
        address minerId

    ){
         Stone memory current = stones[__upc];
        return (
            current.sku,
            current.state,
            current.stoneType,
            current.grade,
            current.cut,
            current.weight,
            current.ownerId,
            current.minerId
        );
    }

    function fetchItemBuffer2(uint __upc) public view returns (
        address graderId,
        address lapidaryId,
        string memory mineLatitude,
        string memory mineLongitude,
        address merchantId,
        address clientId,
        uint price
    ){
        Stone memory current = stones[__upc];

        return (
            current.graderId,
            current.lapidaryId,
            current.mineLatitude,
            current.mineLongitude,
            current.merchantId,
            current.clientId,
            current.price
        );
    }
}