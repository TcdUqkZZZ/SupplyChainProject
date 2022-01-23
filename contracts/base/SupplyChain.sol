pragma solidity >=0.8.0;
import "../accesscontrol/MinerRole.sol" as Miner;
import "../accesscontrol/GraderRole.sol" as Grader;
import "../accesscontrol/MerchantRole.sol" as Merchant;
import "../accesscontrol/LapidaryRole.sol" as Lapidary;
import "../accesscontrol/ClientRole.sol" as Client;
contract SupplyChain is Miner.minerRole ,
                     Grader.graderRole,
                     Merchant.merchantRole,
                     Lapidary.lapidaryRole,
                     Client.clientRole{

    address owner;
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
        uint productId;
        address merchantId;
        address clientId;
        uint price;
    }

    event Mined(uint upc);
    event Faceted(uint upc);
    event Graded(uint upc);
    event ForSale(uint upc);
    event Sold(uint upc);

    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

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

    constructor() payable {
        owner = msg.sender;
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
            require(cutWeight < stones[__upc].weight);
            stones[_upc].cut = _cut;
            stones[_upc].state = State.Faceted;
            emit Faceted(__upc);
        }

        function gradeStone(uint __upc,
        string memory _grade) public onlyGrader faceted(__upc) {
            stones[__upc].grade = _grade;
            stones[__upc].state = State.Graded;
            stones[__upc].graderId = msg.sender;
            emit Graded(_upc);
        }

        function sellStone(uint __upc, uint _price) public
        onlyMerchant graded(__upc){
            stones[__upc].price = _price;
            stones[__upc].state = State.ForSale;
            stones[__upc].merchantId = msg.sender;
            emit ForSale(__upc);
        }

        function buyItem(uint __upc) public payable forSale(__upc) 
        paidEnough(stones[__upc].price)
        checkValue(__upc)
        onlyClient {
            stones[__upc].ownerId = msg.sender;
            stones[__upc].state = State.Sold;
            emit Sold(__upc);
        }

          function fetchItemBuffer(uint __upc) public view returns
    (
        uint sku,
        State state,
        string memory stoneType,
        string memory grade,
        string memory cut,
        uint weight,
        address ownerId,
        address minerId,
        address graderId,
        address lapidaryId,
        string memory mineLatitude,
        string memory mineLongitude,
        uint productId,
        address merchantId,
        address clientId,
        uint price
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
            current.minerId,
            current.graderId,
            current.lapidaryId,
            current.mineLatitude,
            current.mineLongitude,
            current.productId,
            current.merchantId,
            current.clientId,
            current.price

        );
    }



    function fetchProductId(uint __upc) public view returns (uint id) {
        return stones[__upc].productId;
    }

    function fetchMinerId(uint __upc) public view returns (address minerId){
        return stones[__upc].minerId;
    }

    function fetchMineLocation(uint __upc) public view returns 
    (string memory latitude, string memory longitude){
        return (stones[__upc].mineLatitude, stones[__upc].mineLongitude);
    }
 
    function fetchStoneType(uint __upc) public view returns (string memory stoneType){
        return stones[__upc].stoneType;
    }

    function fetchStoneGrade(uint __upc) public view returns (string memory stoneGrade){
        return stones[__upc].grade;
    }

    function fetchOwner(uint __upc) public view returns (address ownerId){
        return stones[__upc].ownerId;
    }
}