pragma solidity >= 0.8.0;

abstract contract Ownable{

    address private myOwner;

    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    constructor () {
        myOwner = msg.sender;
        emit TransferOwnership(address(0), myOwner);
    }

    function owner() public view returns (address) {
        return myOwner;
    }

    modifier onlyOwner() {
        require (isOwner());
        _;
    }

    function isOwner() public view returns (bool){
        return msg.sender == myOwner;
    }

    function renounceOwnership() public onlyOwner {
        emit TransferOwnership(myOwner, address(0));
        myOwner = address(0);
    }

    function transfewrOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "you're looking for renounceOwnership()");
        emit TransferOwnership(myOwner, newOwner);
        myOwner = newOwner;
    }
 


}