// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "./Roles.sol";

contract GraderRole {
    event graderAdded(address indexed addr);
    event graderRemoved(address indexed addr);
    Roles.Role graders;

    constructor() {
        Roles.add(graders, msg.sender);
        emit graderAdded(msg.sender);
    }
    
    modifier onlyGrader {
        require(Roles.has(graders, msg.sender));
        _;
    }

    function isGrader(address account) public view returns (bool){
        return Roles.has(graders, account);
    }

    function addGrader(address account) public onlyGrader {
        _addGrader(account);
    }

    function renounceGrader() public {
        _removeGrader(msg.sender);
    }

    function _addGrader(address account) internal {
        Roles.add(graders, account);
        emit graderAdded(account);
    }

    function _removeGrader(address account) internal{
        Roles.remove(graders, account);
        emit graderRemoved(account);
    }

}