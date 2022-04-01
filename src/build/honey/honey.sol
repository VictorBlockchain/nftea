// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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
      address _contract;
    }
    STIR[] public stirs;

    //_Coll = coll
    //_Con =contract
    mapping(uint256=>STIR[]) public _H2_stir;
    mapping(address=>uint256[]) public _Con2_hId;
    mapping(uint256=>uint256[]) public _N2_hId;
    mapping(address=>mapping(uint256=>uint256)) public _Coll2_N2_H;
    mapping(address=>bool) public isA;

    address public TEAPOT = 0x3c6A3Bc046eBd8Db9160384872a872b35E08158f;
    address public NFTEA =0xFc3F896DC83999A66B302785Eaf44A738E70294d;
    address public TEAPASS = 0x7832714FCAC74fA7245d9866Aaa64275e50C0337;
    address public TEATOKEN = 0xb4668238Acf0314A7b4e153368e479fCd2E09831;
    address public TEASHOP = 0x34BdA9f3B4E9322098040FB4C25364998934A3E0;
    uint256 honeyId;

    constructor() ERC1155("https://nftea.app/nfea/{id}.json") {

      isA[msg.sender]= true;
    }

    function setAddress(address _teapass, address _nftea, address _teapot, address _token, address _teashop) public {

        require(isA[msg.sender], 'you are not an admin');
        NFTEA = _nftea;
        TEAPOT = _teapot;
        TEATOKEN = _token;
        TEASHOP = _teashop;
        TEAPASS = _teapass;
        honeyId = 0;

    }
    function addHoney(uint256 _nft) public {

      address _contract = i1155(NFTEA)._N2_V(_nft);
      require(_Coll2_N2_H[msg.sender][_nft]<1, 'you already added honey');
             (,,,uint256 _power,) = i1155(TEAPASS).getProfile(msg.sender);
      require(_power>3000000*10**9,'you do not have that much power');

      uint256 bal = IERC20(TEATOKEN).balanceOf(TEAPOT);
      require(bal>=_power, 'teapot is low');

        bool success = i1155(TEAPOT).disValue(_contract,_power,TEATOKEN);
        if(success){

            honeyId = honeyId.add(1);

          _Coll2_N2_H[msg.sender][_nft] = _power;

          _Con2_hId[_contract].push(honeyId);
          _N2_hId[_nft].push(honeyId);


          STIR memory save = STIR({
            _collector: msg.sender,
            _nft: _nft,
            _value: _power,
            _date: block.timestamp,
            _contract:_contract

          });

          _H2_stir[honeyId].push(save);
          i1155(TEAPASS).setPower(msg.sender,100000*10**9,2);
        }
    }

    function getHoneyContract(address _contract) public view returns(uint256[] memory){
      return _Con2_hId[_contract];
    }
    function getHoneyNFT(uint256 _nft) public view returns(uint256[] memory){
      return _N2_hId[_nft];
    }
    function getHoneyValue(uint256 _nft, address _stirrer) public view returns(uint256){
      return _Coll2_N2_H[_stirrer][_nft];
    }
    function getStir(uint256 _honeyId) public view returns(STIR[] memory){
      return _H2_stir[_honeyId];
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
