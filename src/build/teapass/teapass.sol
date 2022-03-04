// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface i1155 is IERC1155{

    function disValue(address _contract, uint256 _value, address _token) external returns (bool);
    function disValueTeaPass(address _host, uint256 _value, address _token) external returns (bool);
    function BURN(uint256 _nft, address _collector) external returns (bool);

}
library SafeMath {

    uint constant TEN9 = 10**9;
  /**
   * @dev Multiplies two unsigned integers, reverts on overflow.
   */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {

    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b, "SafeMath#mul: OVERFLOW");

    return c;
  }

  /**
   * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
   */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // Solidity only automatically asserts when dividing by 0
    require(b > 0, "SafeMath#div: DIVISION_BY_ZERO");
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
   * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
   */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a, "SafeMath#sub: UNDERFLOW");
    uint256 c = a - b;

    return c;
  }

  /**
   * @dev Adds two unsigned integers, reverts on overflow.
   */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath#add: OVERFLOW");

    return c;
  }

  /**
   * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
   * reverts when dividing by zero.
   */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0, "SafeMath#mod: DIVISION_BY_ZERO");
    return a % b;
  }

  function decMul18(uint x, uint y) public pure returns (uint decProd) {
    uint prod_xy = mul(x, y);
    decProd = add(prod_xy, TEN9 / 2) / TEN9;
  }

    function decDiv18(uint x, uint y) public pure returns (uint decQuotient) {
    uint prod_xTEN9 = mul(x, TEN9);
    decQuotient = add(prod_xTEN9, y / 2) / y;
  }
}

/// @custom:security-contact security@nftea.app
contract TEAPASS is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
   using SafeMath for uint256;
    //isA = isAdmin
    //isC = isContract
    //_N = nft
    //_A = album
    //_C = collector
    event collectorAdded(
      address _address,
      uint256 _avatar,
      uint256 _cover,
      uint256 _heritage,
      uint256 _gender
    );
    event passConnected(
      address _collector,
      address _host
    );
    event passDissConnected(
      address _collector,
      address _host
    );
    event acceptConnections(
      address _host
    );
    event closeConnections(
      address _host
    );
    struct COLLECTOR {

      address _address;
      uint256 _avatar;
      uint256 _cover;
      uint256 _power;
      uint256 _heritage;
      uint256 _gender;

    }
    COLLECTOR[] public collectors;
    mapping(address=>COLLECTOR) public _C;
    mapping(address=>bool) public isA;
    mapping(address=>bool) public isC;
    mapping(address=>address) public _C2_H;
    mapping(address=>mapping(address=>uint256)) public _C2_H_start;
    mapping(address=>mapping(address=>uint256)) public _C2_H_end;
    mapping(address=>bool) public _C2_connected;
    mapping(address=>uint256) public _H2_connected;
    mapping(address=>address[]) public _H2_collectors;
    mapping(address=>mapping(address=>uint256)) public _C2_Hosts;
    mapping(address=>bool) public _H2_allowConnections;
    mapping(address=>uint256) public _H2_nftToConnect;
    mapping(address=>uint256) public _C2_powerUpgradeDate;
    mapping(address=>address[]) public _H2_coHosts;
    mapping(address=>uint256[]) public _H2_coHostSips;

    address public TOKEN = 0x587725fE0EE1d2c8FAF289Bca546B4B54D6c46D6;
    address public TEASHOP = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public NFTEA = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public TEAPOT = 0x62cfC9b4C09dA06967418345a1f4bb43EDA54bF0;
    address public burn = 0x000000000000000000000000000000000000dEaD;
    uint256 public powerMul = 2;
    uint256 public upgradePowerNFT = 10000;
    uint256 public upgradePower = 0;

    constructor() ERC1155("https://nftea.app/nft/{id}.json") {

        isA[msg.sender] = true;

    }

    function setAdmin (address _admin) public {
      require(isA[msg.sender], 'you are not an admin');
      isA[_admin] = true;
    }
    function allowConnections(uint256 _nft, address[] memory _cohosts, uint256[] memory _sips) public {

      require(_C[msg.sender]._power>=10000, 'your power is too low');
      _H2_allowConnections[msg.sender] = true;
      _H2_nftToConnect[msg.sender] = _nft;
      _H2_coHosts[msg.sender] = _cohosts;
      _H2_coHostSips[msg.sender] = _sips;
      emit acceptConnections(msg.sender);
    }

    function stopConnections() public {

      uint256[] memory _sips;
      address[] memory _hosts;
      _H2_allowConnections[msg.sender] = false;
      _H2_nftToConnect[msg.sender] = 0;
      _H2_coHosts[msg.sender] = _hosts;
      _H2_coHostSips[msg.sender] = _sips;
      emit closeConnections(msg.sender);

    }

    function setProfile(uint256 _avatar, uint256 _cover, uint256 _heritage, uint256 _gender)public {
      require(i1155(NFTEA).balanceOf(msg.sender,_avatar)>0,'you do not own this avatar');
      require(i1155(NFTEA).balanceOf(msg.sender,_cover)>0, 'you do not own this cover');

      COLLECTOR memory save = COLLECTOR({
        _address:msg.sender,
        _avatar:_avatar,
        _cover:_cover,
        _heritage:_heritage,
        _power:1000,
        _gender:_gender
      });
      _C[msg.sender] = save;
      emit collectorAdded(msg.sender, _avatar, _cover, _heritage, _gender);
    }
    function getProfile(address _collector) public view returns(uint256,uint256,uint256,uint256,uint256){

      return (_C[_collector]._avatar,_C[_collector]._cover,_C[_collector]._heritage,_C[_collector]._power,_C[_collector]._gender);

    }
    function updateProfile(uint256 _avatar, uint256 _cover, uint256 _heritage, uint256 _gender)public {

      require(i1155(NFTEA).balanceOf(msg.sender,_avatar)>0,'you do not own this avatar');
      require(i1155(NFTEA).balanceOf(msg.sender,_cover)>0, 'you do not own this cover');
      _C[msg.sender]._avatar = _avatar;
      _C[msg.sender]._cover = _cover;
      _C[msg.sender]._heritage = _heritage;
      _C[msg.sender]._gender = _gender;
      emit collectorAdded(msg.sender, _avatar, _cover, _heritage, _gender);

    }
    function setAddress(address _teashop, address _nftea, address _teapot, address _token) public {

        require(isA[msg.sender], 'you are not an admin');
        TEASHOP = _teashop;
        NFTEA = _nftea;
        TEAPOT = _teapot;
        TOKEN = _token;
        isC[NFTEA] = true;
        isC[TEASHOP] = true;
        isC[TEAPOT] = true;

    }
    function setContract(address _contract) public {

        require(isA[msg.sender], 'you are not an admin');
        isC[_contract] = true;

    }
    function setPowerAdmin(uint256 _powermul, uint256 _upgradenft, uint256 _upgradepower) public {

        require(isA[msg.sender], 'you are not an admin');
        powerMul = _powermul;
        upgradePowerNFT = _upgradenft;
        upgradePower = _upgradepower;

    }
    function setPower(address _collector, uint256 _value, uint256 _type) public returns(bool){

      require(isC[msg.sender] || isA[msg.sender], ' you are not that cool');
      require(_C[_collector]._avatar>0, 'profile not set');
      if(_type==1){

        _C[_collector]._power = _C[_collector]._power.add(_value);

      }else{

          if(_C[_collector]._power.sub(_value)<0){

            _C[_collector]._power = 0;

          }else{

            _C[_collector]._power = _C[_collector]._power.sub(_value);

          }

      }
      return true;

    }

    function setUpgradePower() public{

      require(i1155(NFTEA).balanceOf(msg.sender,upgradePowerNFT)>0, 'you do not own an upgrade nft');
      bool success = i1155(NFTEA).BURN(upgradePowerNFT,msg.sender);
      if(success){

        _C[msg.sender]._power = _C[msg.sender]._power.add(upgradePower);

      }

    }

    function connectPass(address _to, address _token) public {

      require(_H2_allowConnections[_to],'this host is not accepting connections');

      if(_H2_nftToConnect[_to]>0){

        require(i1155(NFTEA).balanceOf(msg.sender,_H2_nftToConnect[_to])>0,'you do not own the nft required to connect');
      }

      if(_C2_connected[msg.sender]){
        address _host = _C2_H[msg.sender];

        if(_C2_H_end[msg.sender][_host]>block.timestamp){
            if(_C[msg.sender]._power.sub(1000)>0){
              _C[msg.sender]._power = _C[msg.sender]._power.sub(1000);
            }else{
              _C[msg.sender]._power = 0;
            }
          _H2_connected[_host] = _H2_connected[_host].sub(1);

        }else{

          uint256 time = _C2_H_end[msg.sender][_host].sub(_C2_H_start[msg.sender][_host]);
          time = time.div(60);
          uint256 _value = _C[msg.sender]._power.mul(powerMul).mul(time);
          _value = _value * 10**9;
          uint256 royalty = 0;
          uint256 sip = 0;
          for (uint256 i = 0; i<_H2_coHosts[_host].length; i++){

            if(_H2_coHostSips[_host][i]>0){

            royalty = _value.mul(_H2_coHostSips[_host][i]).div(100);
            sip = _value.sub(royalty);
            bool success =  i1155(TEAPOT).disValue(_H2_coHosts[_host][i],sip, _token);
            if(success){
              _C2_Hosts[msg.sender][_H2_coHosts[_host][i]] = _C2_Hosts[msg.sender][_H2_coHosts[_host][i]].add(sip);

            }
            }
          }
           _C2_H[msg.sender] = _to;
           _C2_H_start[msg.sender][_to] = block.timestamp;
           _C2_H_end[msg.sender][_to] = block.timestamp + 4 hours;
           _H2_connected[_to] = _H2_connected[_to].add(1);
        }
      }else{

        _C2_H[msg.sender] = _to;
        _C2_H_start[msg.sender][_to] = block.timestamp;
        _C2_H_end[msg.sender][_to] = block.timestamp + 4 hours;
        _H2_connected[_to] = _H2_connected[_to].add(1);
        _C2_connected[msg.sender] = true;

      }
      emit passConnected(msg.sender,_to);
    }

    function disconnectTeaPass() public{

      require(_C2_connected[msg.sender], 'you tea pass is not connected');

      address _host = _C2_H[msg.sender];
      if(block.timestamp > _C2_H_end[msg.sender][_host]){

        _C[msg.sender]._power = _C[msg.sender]._power.sub(1000000);
        _H2_connected[_host] = _H2_connected[_host].sub(1);

      }else{

        uint256 time = _C2_H_end[msg.sender][_host].sub(_C2_H_start[msg.sender][_host]);
        time = time.div(60);
        uint256 _value = _C[msg.sender]._power.mul(powerMul).mul(time);
        uint256 bal = IERC20(TOKEN).balanceOf(TEAPOT);
        _value = _value * 10**9;
        if(bal>_value){

          bool success =  i1155(TEAPOT).disValueTeaPass(_C2_H[msg.sender],_value,TOKEN);
          _C2_Hosts[msg.sender][_C2_H[msg.sender]] = _C2_Hosts[msg.sender][_C2_H[msg.sender]].add(_value);

           if(success){

             _C2_H[msg.sender] = burn;
             _C2_H_start[msg.sender][burn] = block.timestamp;
             _C2_H_end[msg.sender][burn] = block.timestamp - 3 hours;
             _H2_connected[_host] = _H2_connected[_host].sub(1);
             _C2_connected[msg.sender] = false;

           }
        }else{

          _C2_H[msg.sender] = burn;
          _C2_H_start[msg.sender][burn] = block.timestamp;
          _C2_H_end[msg.sender][burn] = block.timestamp - 3 hours;
          _H2_connected[_host] = _H2_connected[_host].sub(1);
          _C2_connected[msg.sender] = false;

        }

      }
      emit passDissConnected(msg.sender,_host);

    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    function checkSuccess()
        private pure
        returns (bool)
      {
        uint256 returnValue = 0;

        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
          // check number of bytes returned from last function call
          switch returndatasize()

            // no bytes returned: assume success
            case 0x0 {
              returnValue := 1
            }

            // 32 bytes returned: check if non-zero
            case 0x20 {
              // copy 32 bytes into scratch space
              returndatacopy(0x0, 0x0, 0x20)

              // load those bytes into returnValue
              returnValue := mload(0x0)
            }

            // not sure what was returned: dont mark as success
            default { }

        }

        return returnValue != 0;
      }
}
