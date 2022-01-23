// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "./Roles.sol";

contract lapidaryRole {
    event lapidaryAdded(address indexed addr);
    event lapidaryRemoved(address indexed addr);
    Roles.Role lapidarys;

    constructor() {
        Roles.add(lapidarys, msg.sender);
        emit lapidaryAdded(msg.sender);
    }
    
    modifier onlyLapidary {
        require(Roles.has(lapidarys, msg.sender));
        _;
    }

    function isLapidary(address account) public view returns (bool){
        return Roles.has(lapidarys, account);
    }

    function addLapidary(address account) public onlyLapidary {
        _addLapidary(account);
    }

    function renounceLapidary() public {
        _removeLapidary(msg.sender);
    }

    function _addLapidary(address account) internal {
        Roles.add(lapidarys, account);
        emit lapidaryAdded(account);
    }

    function _removeLapidary(address account) internal{
        Roles.remove(lapidarys, account);
        emit lapidaryRemoved(account);
    }


}