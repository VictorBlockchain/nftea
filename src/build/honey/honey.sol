// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
interface i1155 is IERC1155{
    function disValue(address _contract, uint256 _value, address _token) external returns (bool);
    function setPower(address _user,uint256 _power, uint256 _type) external returns (bool);
    function _N2_V(uint256 _nft) external returns(address);
    function getProfile(address _collector) external returns(uint256,uint256,uint256,uint256,uint256);

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
contract Honey is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
      using SafeMath for uint256;

    event honeyAdded(
      address _contract,
      uint256 _nft,
      address _collector,
      uint256 _value
    );
    struct STIR{

      address _collector;
      uint256 _nft;
      uint256 _value;
      uint256 _date;
    }
    STIR[] public stirs;

    mapping(address=>STIR[]) public _N2_stirs;
    mapping(address=>mapping(address=>uint256)) public _C2_N2_value;
    mapping(address=>mapping(address=>uint256)) public _N2_C2_value;
    mapping(address=>mapping(address=>STIR)) public _C2_N2_stir;
    mapping(address=>mapping(address=>STIR)) public _N2_C2_stir;
    mapping(address=>bool) public isA;
    address public TEAPOT = 0x3c6A3Bc046eBd8Db9160384872a872b35E08158f;
    address public NFTEA =0x7F40081F0D15CDf100e467FC9476bF8625D502A2;
    address public TEAPASS = 0xcB442DB06D444c0126693808f555b6D7cbC6846A;
    address public TEATOKEN = 0xf7eAbF593C481DA0476B989f3E86D18010103C00;

    constructor() ERC1155("https://nftea.app/nfea/{id}.json") {

      isA[msg.sender]= true;
    }

    function setAddress(address _teapass, address _nftea, address _teapot, address _token) public {

        require(isA[msg.sender], 'you are not an admin');
        NFTEA = _nftea;
        TEAPOT = _teapot;
        TEATOKEN = _token;
        TEAPASS = _teapass;

    }
    function addHoney(uint256 _nft) public {

      require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)<1, 'can not give yourself honey');
      address _contract = i1155(NFTEA)._N2_V(_nft);
      require(_C2_N2_value[msg.sender][_contract]<1, 'you already added honey');
             (,,,uint256 _power,) = i1155(TEAPASS).getProfile(msg.sender);
      require(_power>0,'you do not have that much power');

      bool success = i1155(TEAPOT).disValue(_contract,_power,TEATOKEN);
      if(success){

        _C2_N2_value[msg.sender][_contract] = _power;
        _N2_C2_value[_contract][msg.sender] = _power;

        STIR memory save = STIR({
          _collector: msg.sender,
          _nft: _nft,
          _value: _power,
          _date: block.timestamp

        });
        _N2_C2_stir[_contract][msg.sender] = save;
        _C2_N2_stir[msg.sender][_contract] = save;
        _N2_stirs[_contract].push(save);
        i1155(TEAPASS).setPower(msg.sender,1000,2);
      }


    }
    function getHoney(address _contract) public view returns(STIR[] memory){
      return _N2_stirs[_contract];
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
}
