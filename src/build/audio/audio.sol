// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

}
library DateTime {
    uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint256 constant SECONDS_PER_HOUR = 60 * 60;
    uint256 constant SECONDS_PER_MINUTE = 60;
    int256 constant OFFSET19700101 = 2440588;

    uint256 constant DOW_MON = 1;
    uint256 constant DOW_TUE = 2;
    uint256 constant DOW_WED = 3;
    uint256 constant DOW_THU = 4;
    uint256 constant DOW_FRI = 5;
    uint256 constant DOW_SAT = 6;
    uint256 constant DOW_SUN = 7;

    // ------------------------------------------------------------------------
    // Calculate the number of days from 1970/01/01 to year/month/day using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and subtracting the offset 2440588 so that 1970/01/01 is day 0
    //
    // days = day
    //      - 32075
    //      + 1461 * (year + 4800 + (month - 14) / 12) / 4
    //      + 367 * (month - 2 - (month - 14) / 12 * 12) / 12
    //      - 3 * ((year + 4900 + (month - 14) / 12) / 100) / 4
    //      - offset
    // ------------------------------------------------------------------------
    function _daysFromDate(
        uint256 year,
        uint256 month,
        uint256 day
    ) internal pure returns (uint256 _days) {
        require(year >= 1970);
        int256 _year = int256(year);
        int256 _month = int256(month);
        int256 _day = int256(day);

        int256 __days =
            _day -
                32075 +
                (1461 * (_year + 4800 + (_month - 14) / 12)) /
                4 +
                (367 * (_month - 2 - ((_month - 14) / 12) * 12)) /
                12 -
                (3 * ((_year + 4900 + (_month - 14) / 12) / 100)) /
                4 -
                OFFSET19700101;

        _days = uint256(__days);
    }

    function getMinute(uint256 timestamp)
        internal
        pure
        returns (uint256 minute)
    {
        uint256 secs = timestamp % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
    }

    function getSecond(uint256 timestamp)
        internal
        pure
        returns (uint256 second)
    {
        second = timestamp % SECONDS_PER_MINUTE;
    }

    function addDays(uint256 timestamp, uint256 _days)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _days * SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }

    function addHours(uint256 timestamp, uint256 _hours)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _hours * SECONDS_PER_HOUR;
        require(newTimestamp >= timestamp);
    }

    function addMinutes(uint256 timestamp, uint256 _minutes)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp >= timestamp);
    }

    function addSeconds(uint256 timestamp, uint256 _seconds)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _seconds;
        require(newTimestamp >= timestamp);
    }

    function subDays(uint256 timestamp, uint256 _days)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _days * SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }

    function subHours(uint256 timestamp, uint256 _hours)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _hours * SECONDS_PER_HOUR;
        require(newTimestamp <= timestamp);
    }

    function subMinutes(uint256 timestamp, uint256 _minutes)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp <= timestamp);
    }

    function subSeconds(uint256 timestamp, uint256 _seconds)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _seconds;
        require(newTimestamp <= timestamp);
    }

    function diffHours(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _hours)
    {
        require(fromTimestamp <= toTimestamp);
        _hours = (toTimestamp - fromTimestamp) / SECONDS_PER_HOUR;
    }

    function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _minutes)
    {
        require(fromTimestamp <= toTimestamp);
        _minutes = (toTimestamp - fromTimestamp) / SECONDS_PER_MINUTE;
    }

    function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _seconds)
    {
        require(fromTimestamp <= toTimestamp);
        _seconds = toTimestamp - fromTimestamp;
    }
}

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}
contract NFTEACAFE is Initializable, ERC1155Upgradeable, OwnableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    using SafeMath for uint256;

    event roomOpen(

        uint256 _room,
        address _owner
    );
    event roomClosed(

        uint256 _room,
        address _owner
    );
    event passConnected(

        uint256 _room,
        address _listener
    );
    event roomExit(

        uint256 _room,
        address _listener
    );
    event handRaised(
      uint256 _room,
      address _listerner
    );
    struct ROOMS{

      uint256 id;
      address host;
      string title;
      string info;
      uint256 earnings;
      uint256 start;
      uint256 stop;
      uint256 fee;
      bool paid;
      uint256 rate;
      uint256 timePay;
      string category;
    }
    ROOMS[] public rooms;

    struct NFTS{

      uint256 id;
      uint256 price;
      string ipfs;
      bool canTransfer;
      uint256 quantity;
    }
    NFTS[] public nft;

    mapping(uint256=>NFTS) public idToNFT;
    mapping(uint256=>ROOMS) public idToRoom;
    mapping(address=>mapping(uint256=>ROOMS)) public hostToRoom;
    mapping(address=>uint256[]) public hostToAllRooms;
    mapping(uint256=>address[]) public roomToCoHosts;
    mapping(uint256=>address[]) public roomToListeners;
    mapping(address=>uint256) public listenerToRoom;
    mapping(uint256=>uint256) public roomToEarnings;
    mapping(address=>bool) public isAdmin;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToStartTime;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToEndTime;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToPayment;
    mapping(address=>uint256) public listenerToTotalPayment;
    mapping(address=>uint256) public hostToTotalEarned;
    mapping(address=>uint256) public userToWarning;
    mapping(address=>bool) public banned;
    mapping(address=>uint256) public bannedExpire;
    mapping(address=>uint256) public userToNftForBanRemove;
    mapping(uint256=>uint256) public roomToMaxTime;
    mapping(address=>uint256[]) public listenerToAllRooms;
    mapping(uint256=>address[]) public roomToHandsRaised;
    mapping(uint256=>bool) public idToRoomOpen;
    mapping(uint256=>uint256) public idToRoomCloseByTime;
    mapping(uint256=>uint256) public nftToTransfers;
    mapping(uint256=>bool) public canTransfer;
    mapping(uint256=>uint256) public roomToPayDate;
    mapping(uint256=>uint256) public roomToNFTToJoin;
    mapping(uint256=>uint256) public nftToStreamTime;
    mapping(address=>uint256) public addressToTEAPASSLIMIT;

    address public TEA = 0x044B2F4d2F37CbD4bf955E1E2B0041dc3fC8e022;
    address public NFTEA = 0x044B2F4d2F37CbD4bf955E1E2B0041dc3fC8e022;
    uint256 public rate = 100000000;
    uint256 public purse;
    uint256 public cheers;
    uint256 public roomId;
    uint256 public nftId;
    uint256 public penalty;
    address public burn = 0x000000000000000000000000000000000000dEaD;
    address public operations;


    constructor() initializer {}

    function initialize() initializer public {

        __ERC1155_init("https://nftea.app/audio/{id}.json");
        __Ownable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();

        roomId = 0;
        nftId = 0;
        // bytes memory empty;
        // mint(address(this), 1, _tTotal,empty);

    }

    receive () external payable {

    }

    function SETROOM(uint256 _fee, address[] memory _cohosts, string memory _info, string memory _title,uint256 _nft, string memory _category) public{

       require(IERC20(TEA).balanceOf(msg.sender)>=penalty,' You must have TEA tokens to host a room');

        roomId = SafeMath.add(roomId,1);

        uint256 h = addressToTEAPASSLIMIT[msg.sender];
        if(h<30){
          h=30;
          }
        uint256 _end = DateTime.addMinutes(block.timestamp,h);
        uint256 _start = block.timestamp + 3 minutes;

        ROOMS memory save = ROOMS({

          id:roomId,
          host: msg.sender,
          fee: _fee,
          start: _start,
          stop: _end,
          info: _info,
          title: _title,
          earnings: 0,
          paid:false,
          rate:0,
          timePay:0,
          category:_category

        });

        roomToCoHosts[roomId] = _cohosts;

        roomToNFTToJoin[roomId]=_nft;
        idToRoom[roomId] = save;
        hostToRoom[msg.sender][roomId] = save;
        hostToAllRooms[msg.sender].push(roomId);
        roomToMaxTime[roomId] =_end;
        idToRoomOpen[roomId] = true;
        idToRoomCloseByTime[roomId] = block.timestamp + 180 minutes;
        emit roomOpen(roomId, msg.sender);

    }

    function CONNECTPASS(uint256 _room) public{

      require(idToRoomOpen[_room], 'this room is closed');
      require(listenerToRoom[msg.sender]!=_room, 'you are already in this room');

      uint256 _inRoom = listenerToRoom[msg.sender];
      if(_inRoom>0 && idToRoom[_room].stop < block.timestamp){

       SETDISCONNECT(_room,0);

      }else{

        listenerToRoom[msg.sender] = _room;
        roomToListeners[_room].push(msg.sender);
        listenerToRoomToStartTime[msg.sender][_room] = block.timestamp;
        listenerToRoomToPayment[msg.sender][_room] = 0;
        // listenerToAllRooms[msg.sender].push(_room);

        emit passConnected(_room, msg.sender);

     }
    }

    function SETDISCONNECT(uint256 _room,uint256 _index) public returns(bool){

      require(listenerToRoom[msg.sender] == _room, ' you are not in this room');
      uint256 roomTime = block.timestamp.sub(listenerToRoomToStartTime[msg.sender][_room]);
      uint256 maxTime = idToRoom[_room].stop.sub(idToRoom[_room].start);

      if(roomTime>maxTime){

        roomTime = idToRoom[_room].stop.sub(listenerToRoomToStartTime[msg.sender][_room]);

      }else{

        roomTime = block.timestamp.sub(listenerToRoomToStartTime[msg.sender][_room]);

      }

      uint256 hostPay = roomTime.mul(rate).div(60);
      listenerToRoomToPayment[msg.sender][_room] = hostPay;
      listenerToRoomToEndTime[msg.sender][_room] = block.timestamp;
      hostToTotalEarned[idToRoom[_room].host] = hostToTotalEarned[idToRoom[_room].host].add(hostPay);
      roomToEarnings[_room] = roomToEarnings[_room].add(hostPay);
      listenerToRoom[msg.sender] = 0;
      delete roomToListeners[_room][_index];
      emit roomExit(_room, msg.sender);
      return true;
    }

    function SETRAISEHAND(uint256 _room) public returns(bool){

      uint256 _fee = idToRoom[_room].fee;
      uint256 _cheers = _fee.mul(3).div(100);
      uint256 _value = _fee.sub(_cheers);
      require(IERC20(TEA).balanceOf(msg.sender)>=_fee,' You must have enough to cover the question fee');
      require(idToRoomOpen[_room], 'this room is closed');

      bool success = IERC20(TEA).transferFrom(msg.sender,address(this),_fee);
      if(success){

        roomToHandsRaised[_room].push(msg.sender);
        hostToTotalEarned[idToRoom[_room].host] = hostToTotalEarned[idToRoom[_room].host].add(_value);
        listenerToTotalPayment[msg.sender]= listenerToTotalPayment[msg.sender].add(_value);
        roomToEarnings[_room]= roomToEarnings[_room].add(_value);
        listenerToRoomToPayment[msg.sender][_room] = _value;
        emit handRaised(_room,msg.sender);
        return true;

      }else{

        return false;

      }

    }

    function SETCLOSEROOM(uint256 _room) public{

      require(idToRoom[_room].host == msg.sender, ' you are not the host');
      if(idToRoomCloseByTime[_room]<block.timestamp){

        bool success = IERC20(TEA).transferFrom(idToRoom[_room].host,address(this),penalty);
        if(success){

          PAYHOSTS(_room);

        }

      }else{

        PAYHOSTS(_room);

        idToRoomOpen[_room] = false;
        if(hostToAllRooms[msg.sender].length % 20 == 0 && addressToTEAPASSLIMIT[msg.sender] <240){
          addressToTEAPASSLIMIT[msg.sender] = addressToTEAPASSLIMIT[msg.sender].add(30);
        }

      }
    }

    function PAYHOSTS(uint256 _room) private returns(bool){

      require(!idToRoom[_room].paid, 'earnings already paid');
      uint256 total = roomToCoHosts[_room].length;

      uint256 split = roomToEarnings[_room].div(total);

      // uint256 totalTime = 0;

      // for (uint256 i = 0; i < roomToListeners[_room].length; i++) {
      //   address participants = roomToListeners[_room][i];
      //   if(listenerToRoomToEndTime[participants][_room]==0){
      //     listenerToRoomToEndTime[participants][_room] = idToRoom[_room].stop;
      //   }
      //   uint256 time = listenerToRoomToEndTime[participants][_room].sub(listenerToRoomToStartTime[participants][_room]);
      //   totalTime.add(time);
      // }
      // totalTime = totalTime.div(60);
      // uint256 timePay = totalTime.mul(rate);
      // amount = amount.add(timePay).div(total);

      for (uint256 i = 0; i < roomToCoHosts[_room].length; i++) {

        IERC20(TEA).transfer(roomToCoHosts[_room][i],split);

      }
      //idToRoom[_room].rate = rate;
      //idToRoom[_room].timePay = timePay;
      idToRoomOpen[_room] = false;
      idToRoom[_room].paid = true;
      roomToPayDate[_room] = block.timestamp;
      emit roomClosed(_room, msg.sender);
      return true;

    }

    function PAYTEAPASS(uint256 _room, uint256 _nft) public returns(bool){

      require(idToRoom[_room].host==msg.sender, 'you are not the host');
      uint256 totalTime = 0;

      for (uint256 i = 0; i < roomToListeners[_room].length; i++) {
        address participants = roomToListeners[_room][i];
        if(listenerToRoomToEndTime[participants][_room]==0){
          listenerToRoomToEndTime[participants][_room] = idToRoom[_room].stop;
        }
        uint256 time = listenerToRoomToEndTime[participants][_room].sub(listenerToRoomToStartTime[participants][_room]);
        totalTime.add(time);
      }

      totalTime = totalTime.div(60);
      uint256 timePay = totalTime.mul(rate);
      //IERC1155(NFTEA).SET_DISVALUE_PARTNERS(_nft,timePay,TEA);
      return true;
    }

    function SETADMIN(address _user) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      if(isAdmin[_user]){

        isAdmin[_user] = false;
      }else{
        isAdmin[_user] = true;
      }
      return true;
    }

    function SETTEA(address _TEA,address _NFTEA) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      TEA = _TEA;
      NFTEA = _NFTEA;
      return true;
    }

    function SETPASSLIMIT(address _user,uint256 _time) public returns(bool){

      require(isAdmin[msg.sender], 'you are not an admin');
      addressToTEAPASSLIMIT[_user] = _time;
      return true;
    }

    function withdraw() public returns(bool){

      require(isAdmin[msg.sender], ' you are not an admin');
      uint256 bal = IERC20(TEA).balanceOf(address(this));
      IERC20(TEA).transfer(operations,bal);

      return true;

    }

    function GET_HOST_ROOMS(address _host) public view returns(uint256[] memory){

      return hostToAllRooms[_host];
    }

    function GET_RAISED_HANDS(uint256 _room) public view returns(address[] memory){

      return roomToHandsRaised[_room];
    }

    function GET_LISTENERS(uint256 _room) public view returns(address[] memory){

      return roomToListeners[_room];
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
      super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
