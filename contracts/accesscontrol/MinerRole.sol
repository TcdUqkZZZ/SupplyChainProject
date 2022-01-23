// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "./Roles.sol";

contract minerRole {
    event minerAdded(address indexed addr);
    event minerRemoved(address indexed addr);
    Roles.Role miners;

    constructor() {
        Roles.add(miners, msg.sender);
        emit minerAdded(msg.sender);
    }
    
    modifier onlyMiner {
        require(Roles.has(miners, msg.sender));
        _;
    }

    function isMiner(address account) public view returns (bool){
        return Roles.has(miners, account);
    }

    function addMiner(address account) public onlyMiner {
        _addMiner(account);
    }

    function renounceMiner() public {
        _removeMiner(msg.sender);
    }

    function _addMiner(address account) internal {
        Roles.add(miners, account);
        emit minerAdded(account);
    }

    function _removeMiner(address account) internal{
        Roles.remove(miners, account);
        emit minerRemoved(account);
    }

}