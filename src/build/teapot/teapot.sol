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
    function setPower(address _user,uint256 _power, uint256 _type) external returns (bool);
    function approveTransfers(address _contract, address _token) external returns(bool);
    function withdrawBNB(address _to) external returns(bool);
    function payArtist(uint256 _nft, uint256 _value) external returns(bool);
    function GET_SIPS(uint256 _nft) external returns(address[] memory, uint256[] memory);

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

contract VAULT {

  uint256 nft;
  string ipfs;
  address nftea;
  address teaToken;
  mapping(address=>bool) internal _isC;

  constructor(uint256 _nft, string memory _ipfs, address _creator, address _nftea, address _teaToken){

    nft = _nft;
    ipfs = _ipfs;
    nftea = _nftea;
    teaToken = _teaToken;
    _isC[_creator] = true;
    IERC20(teaToken).approve(_creator,100000000000000000000000000000000000000000);
    i1155(nftea).setApprovalForAll(_creator,true);
  }
  receive () external payable {

  }

  function approveTransfers(address _contract, address _token) public returns(bool) {

    require(_isC[msg.sender], 'you are not that cool');
    IERC20(_token).approve(_contract,100000000000000000000000000000000000000000);
    i1155(nftea).setApprovalForAll(_contract,true);
    return true;
  }

  function withdrawBNB(address _to) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    payable(address(_to)).transfer(address(this).balance);
    return true;
  }

  function withdrawNFT(address _to, uint256 _nft) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    safeTransferFrom(address(this),_nft, _to);
    return true;
  }

  function approve1155(address _contract, address _creator) public returns(bool){

    require(_isC[msg.sender], 'you are not that cool')
    i1155(_contract).setApprovalForAll(_creator,true);

  }

}

/// @custom:security-contact security@nftea.app
contract TEAPOT is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
using SafeMath for uint256;
    /// @custom:oz-upgrades-unsafe-allow constructor
    //isA = isAdmin
    //isC = isContract
    //isT = isToken
    //_N = nft
    //_T = token
    //_V = vault

    event addBrew(

      uint256 _nft,
      uint256 _value
    );
    event subBrew(

      uint256 _nft,
      uint256 _value
    );
    event vaultCreated(

      address _contract,
      uint256 _nft,
      uint256 _wnft,
      string _ipfs
    );
    event approveVaulT(
      address _collector,
      address _vault
    );
    event vaultClaimed(
      address _collector,
      address _vault
    );
    struct SAFE {

      address _contract;
      uint256 _nft;
      uint256 _wnft;
      uint256 _brew;
    }
    SAFE[] public brews;

    mapping(address=>bool) public isA;
    mapping(address=>bool) public isC;
    mapping(uint256=>address) public _N2_V;
    mapping(address=>uint256) public _V2_N;
    mapping(uint256=>SAFE) public _N2_S;
    mapping(address=>address[]) public _allVaults;
    mapping(address=>string) public _V2_IPFS;
    mapping(address=>uint256) public specialToken;

    address public NFTEA;
    address public TEAPASS;
    address public TOKEN;
    address public TEASHOP;
    address public FEEADDRESS;
    address public burn = 0x000000000000000000000000000000000000dEaD;

    constructor() ERC1155("https://nftea.app/nft/{id}.json") {

        isA[msg.sender] = true;

    }
    receive () external payable {

    }

    function approveVaultTransfers(uint256 _nft, address _token) public {

      require(i1155(NFTEA).balanceOf(msg.sender,_nft)>0,'you do not own this nft');
      address _contract = _N2_V[_nft];
      i1155(_contract).approveTransfers(address(this), _token);
      emit approveVaulT(msg.sender, _contract);
    }
    function approveVault1155(uint256 _nft, address _nftcontract) public {

      require(i1155(_nftcontract).balanceOf(msg.sender,_nft)>0,'you do not own this nft');
      address _contract = _N2_V[_nft];
      i1155(_contract).approve1155(_nftcontract,address(this));
      emit approveVaulT(msg.sender, _contract);
    }
    function removeVaultBNB(uint256 _nft) public {

        require(i1155(NFTEA).balanceOf(msg.sender,_nft)>0,'you do not own this nft');
        require(_N2_S[_nft]._brew>block.timestamp, 'not time to brew');

        address _contract = _N2_V[_nft];
        i1155(_contract).withdrawBNB(msg.sender);
        require(checkSuccess(), "remove token failed");

    }

    function disValue(address _vault, uint256 _value, address _token) public returns(bool){

        require(isC[msg.sender], 'you are not cool enough');
        require(IERC20(_token).balanceOf(address(this))>=_value, 'teapot empty');
        require(_V2_N[_vault]>0, 'this vault does not exist');
        uint256 _nft = _V2_N[_vault];

        IERC20(_token).transfer(_N2_S[_nft]._contract,_value);
        require(checkSuccess(), "add brew failed");
        return true;
    }

    function disValueTeaPass(address _host, uint256 _value, address _token) public returns(bool){

        require(isC[msg.sender], 'you are not cool enough');
        require(IERC20(_token).balanceOf(address(this))>=_value, 'teapot empty');
        IERC20(_token).transfer(_host,_value);
        require(checkSuccess(), "distribute tea pass failed");
        return true;

    }

    function rT(address _token, uint256 _type) public {

        require(isA[msg.sender], 'you are not cool enough');
        if(_type==1){
        uint256 bal = IERC20(_token).balanceOf(address(this));

        require(bal>0, 'teapot empty');
        IERC20(_token).transfer(msg.sender,bal);
        require(checkSuccess(), "remove token failed");
        }else{

            payable(address(msg.sender)).transfer(address(this).balance);

        }
    }

    function setVault(uint256 _nft, string memory _ip) public returns (address){

      require(isC[msg.sender], ' not an approved contract');

      address vault = address(new VAULT(_nft,_ip,address(this),NFTEA,TOKEN));

      _V2_N[vault] = _nft;
      _N2_V[_nft] = vault;

      SAFE memory save = SAFE({
        _contract:vault,
        _nft:_nft,
        _wnft: 0,
        _brew: block.timestamp - 1 days
      });
      brews.push(save);
      _N2_S[_nft] = save;
      _allVaults[address(this)].push(vault);
      _V2_IPFS[vault] = _ip;
      emit vaultCreated(vault, _nft, 0, _ip);

      return vault;

    }

    function clearVault(uint256 _index) public {
      require(isC[msg.sender], 'you are not that cool');
      delete _allVaults[address(this)][_index];
    }

    function getVaults() public view returns (address[] memory) {

        return _allVaults[address(this)];

    }
    function getVault(uint256 _nft) public view returns(address,uint256){

      address _contract = _N2_V[_nft];
      uint256 _brew = _N2_S[_nft]._brew;
      return(_contract,_brew);

    }
    function SET_ADDRESSES(address _token, address _nftea, address _teapass, address _teashop, address _fees ) public {
      require(isA[msg.sender],'you are not an admin');

            TEAPASS = _teapass;
            TOKEN = _token;
            TEASHOP = _teashop;
            FEEADDRESS = _fees;
            NFTEA = _nftea;
            isC[TEAPASS] = true;
            isC[TEASHOP] = true;
            isC[NFTEA] = true;
    }
    function setAdmin(address _user, bool _A) public{

        require(isA[msg.sender], 'you are not an admin');
        isA[_user] = _A;
    }

    function setContract(address _C, bool _A) public {
        require(isA[msg.sender], ' you are not an admin');
                isC[_C] = _A;
    }

    function setBrewToken(uint256 _nft, uint256 _value,address _token, uint256 _brewDate) public{


        require(i1155(NFTEA).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');

        require(_N2_S[_nft]._brew<_brewDate, 'cannot change your brew date');
        IERC20(_token).transferFrom(msg.sender,_N2_S[_nft]._contract, _value);
        require(checkSuccess(), "add brew failed");
        _N2_S[_nft]._brew = _brewDate;
        emit addBrew(_nft,_value);

    }

    function setSubBrew(uint256 _nft, address _token, uint256 _othernft) public{

      require(i1155(NFTEA).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(block.timestamp>_N2_S[_nft]._brew, 'not time to brew');

        if(_othernft<1){

          address _contract = _N2_S[_nft]._contract;
          uint256 bal= IERC20(_token).balanceOf(_contract);
          uint256 save = bal.mul(1).div(100);
          bal = bal.sub(save);
          uint256 artistfee = bal.mul(6).div(100);
          uint256 value = bal.sub(artistfee);

          IERC20(_token).transferFrom(_contract,msg.sender, value);
          require(checkSuccess(), "set sub brew failed");

          (address[] memory artists, uint256[] memory sips) = i1155(NFTEA).GET_SIPS(_nft);

          uint256 sip;

          for (uint256 i = 0; i<artists.length; i++){

            if(sips[i]>0){

            sip = artistfee.mul(sips[i]).div(100);

            IERC20(_token).transferFrom(_contract,artists[i], sip);
            require(checkSuccess(), "vault royalty failed");

            }
          }

           emit subBrew(_nft,bal);

        }else{

          uint256 nftBal = i1155(NFTEA).balanceOf(_N2_S[_nft]._contract,_othernft);
          require(nftBal>0,'this vault does not hold this nft');
          i1155(_token).safeTransferFrom(_N2_S[_nft]._contract,msg.sender,_nft,nftBal,'');
          require(checkSuccess(), "add wrapped brew failed");
          emit subBrew(_nft,nftBal);

        }

    }

    function claimVault(address _contract, uint256 _toNFT, uint256 _type) public {

      uint256 _nft = _V2_N[_contract];

      if(_N2_S[_nft]._wnft>0){
        _nft = _N2_S[_nft]._wnft;
      }
      if(_type==1){

        require(i1155(NFTEA).balanceOf(burn,_nft)>0,'this vault is active');

      }else{

        uint time = block.timestamp + 7 * 1095 days;
        require(block.timestamp>time,'this is not expired');

      }
      require(i1155(NFTEA).balanceOf(msg.sender,_toNFT)>0, ' you do not own this nft');

      _N2_S[_toNFT] = _N2_S[_nft];
      _V2_N[_contract] = _toNFT;
      _N2_V[_toNFT] = _contract;
      _N2_V[_nft] = burn;
      emit vaultClaimed(msg.sender,_contract);
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
