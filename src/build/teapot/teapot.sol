// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

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
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
interface IERC1155Receiver is IERC165 {
    /**
        @dev Handles the receipt of a single ERC1155 token type. This function is
        called at the end of a `safeTransferFrom` after the balance has been updated.
        To accept the transfer, this must return
        `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
        (i.e. 0xf23a6e61, or its own function selector).
        @param operator The address which initiated the transfer (i.e. msg.sender)
        @param from The address which previously owned the token
        @param id The ID of the token being transferred
        @param value The amount of tokens being transferred
        @param data Additional data with no specified format
        @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
    */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
        @dev Handles the receipt of a multiple ERC1155 token types. This function
        is called at the end of a `safeBatchTransferFrom` after the balances have
        been updated. To accept the transfer(s), this must return
        `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
        (i.e. 0xbc197c81, or its own function selector).
        @param operator The address which initiated the batch transfer (i.e. msg.sender)
        @param from The address which previously owned the token
        @param ids An array containing ids of each token being transferred (order and length must match values array)
        @param values An array containing amounts of each token being transferred (order and length must match ids array)
        @param data Additional data with no specified format
        @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
    */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}

interface IERC1155 is IERC165 {
    /**
     * @dev Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    /**
     * @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
     * transfers.
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /**
     * @dev Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
     * `approved`.
     */
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    /**
     * @dev Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.
     *
     * If an {URI} event was emitted for `id`, the standard
     * https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
     * returned by {IERC1155MetadataURI-uri}.
     */
    event URI(string value, uint256 indexed id);

    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        external
        view
        returns (uint256[] memory);

    /**
     * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
     *
     * Emits an {ApprovalForAll} event.
     *
     * Requirements:
     *
     * - `operator` cannot be the caller.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
     *
     * See {setApprovalForAll}.
     */
    function isApprovedForAll(address account, address operator) external view returns (bool);

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must be have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

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
    IERC1155(nftea).setApprovalForAll(_creator,true);
  }
  receive () external payable {

  }

  function approveTransfers(address _contract, address _token) public returns(bool) {

    require(_isC[msg.sender], 'you are not that cool');
    IERC20(_token).approve(_contract,100000000000000000000000000000000000000000);
    IERC1155(nftea).setApprovalForAll(_contract,true);
    return true;
  }

  function withdrawBNB(address _to) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    payable(address(_to)).transfer(address(this).balance);
    return true;
  }

}

/// @custom:security-contact security@nftea.app
contract TEAPOT is Initializable, ERC1155Upgradeable, OwnableUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, UUPSUpgradeable {
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
    mapping(address=>uint256) public _T2Bal;
    mapping(address=>address[]) public _allVaults;
    mapping(address=>string) public _V2_IPFS;
    mapping(address=>uint256) public specialToken;

    address public NFTEA = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public TEATOKEN = 0x587725fE0EE1d2c8FAF289Bca546B4B54D6c46D6;
    address public FEEADDRESS = 0xA632BEF122D88c5F6c3e7988BA87d0a1e7d11655;
    address public SHOP = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public burn = 0x000000000000000000000000000000000000dEaD;

    constructor() initializer {

        isA[msg.sender] = true;
        isC[msg.sender] = true;
    }


    function initialize() initializer public {

        __ERC1155_init("https://nftea.app/nft/{id}.json");
        __Ownable_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __UUPSUpgradeable_init();


    }
    receive () external payable {

    }

    function approveVaultTransfers(uint256 _nft, address _token) public {

      require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)>0,'you do not own this nft');
      address _contract = _N2_V[_nft];
      IERC1155(_contract).approveTransfers(address(this), _token);

    }
    function removeVaultBNB(uint256 _nft) public {

        require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)>0,'you do not own this nft');
        require(_N2_S[_nft]._brew>block.timestamp, 'not time to brew');

        address _contract = _N2_V[_nft];
        IERC1155(_contract).withdrawBNB(msg.sender);
        require(checkSuccess(), "remove token failed");

    }

    function disValue(address _vault, uint256 _value, address _token) public {

        require(isC[msg.sender], 'you are not cool enough');
        require(IERC20(_token).balanceOf(address(this))>_value, 'teapot empty');
        require(_V2_N[_vault]>0, 'this vault does not exist');
        uint256 _nft = _V2_N[_vault];

        IERC20(_token).transferFrom(address(this),_N2_S[_nft]._contract,_value);
        require(checkSuccess(), "add brew failed");

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

      address vault = address(new VAULT(_nft,_ip,address(this),NFTEA,TEATOKEN));

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
    function setAddress(address _A, address _B, uint256 _type) public {

        require(isA[msg.sender], 'you are not an admin');
        if(_type==1){

          NFTEA = _A;
          TEATOKEN = _B;

        }else if (_type==2){
          FEEADDRESS = _A;
          SHOP = _B;
        }
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

      if(_N2_S[_nft]._wnft>0){

        _nft = _N2_S[_nft]._wnft;
        require(IERC1155(address(this)).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');

      }else{

        require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');

      }
        require(_N2_S[_nft]._brew>_brewDate, 'cannot change your brew date');
        IERC20(_token).transferFrom(msg.sender,_N2_S[_nft]._contract, _value);
        require(checkSuccess(), "add brew failed");
        _N2_S[_nft]._brew = _brewDate;

      _T2Bal[_token] = _T2Bal[_token].add(_value);
      emit addBrew(_nft,_value);

    }

    function setSubBrew(uint256 _nft, address _token, uint256 _othernft) public{

      if(_N2_S[_nft]._wnft>0){

        _nft = _N2_S[_nft]._wnft;
        require(IERC1155(address(this)).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');

      }else{

        require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');

      }

      require(_N2_S[_nft]._brew>block.timestamp, 'not time to brew');

        if(_othernft<1){

          address _contract = _N2_S[_nft]._contract;
          uint256 bal= IERC20(_token).balanceOf(_contract);
          uint256 artistfee = bal.mul(4).div(100);
          uint256 platformfee = bal.mul(2).div(100);
          uint256 cheers = bal.mul(2).div(100);
          uint256 value = bal.sub(artistfee).sub(platformfee).sub(cheers);

          IERC20(_token).transferFrom(_contract,msg.sender, value);
          require(checkSuccess(), "set sub brew failed");
          IERC20(_token).transferFrom(_contract,FEEADDRESS, platformfee);
          require(checkSuccess(), "set sub brew failed");
          IERC20(_token).transferFrom(_contract,address(this), cheers);
          require(checkSuccess(), "set sub brew failed");

          (address[] memory artists, uint256[] memory sips) = IERC1155(NFTEA).GET_SIPS(_nft);
          uint256 royalty;
          uint256 sip;

          for (uint256 i = 0; i<artists.length; i++){

            if(sips[i]>0){

            royalty = artistfee.mul(sips[i]).div(100);
            sip = artistfee.sub(royalty);
            address artist = artists[i];
            IERC20(_token).transferFrom(_contract,artist, sip);
            require(checkSuccess(), "vault royalty failed");

            }
          }
          _T2Bal[_token] = _T2Bal[_token].sub(bal);
           emit subBrew(_nft,bal);

        }else{

          uint256 nftBal = IERC1155(address(this)).balanceOf(_N2_S[_nft]._contract,_othernft);
          require(nftBal>0,'this vault does not hold this nft');
          if(_N2_S[_nft]._wnft>0){

            IERC1155(address(this)).safeTransferFrom(_N2_S[_nft]._contract,msg.sender,_nft,nftBal,'');
            require(checkSuccess(), "add wrapped brew failed");

          }else{

            IERC1155(_token).safeTransferFrom(_N2_S[_nft]._contract,msg.sender,_nft,nftBal,'');
            require(checkSuccess(), "add wrapped brew failed");

          }
          emit subBrew(_nft,nftBal);

        }

    }

    function claimVault(address _contract, uint256 _toNFT, uint256 _type) public {

      uint256 _nft = _V2_N[_contract];

      if(_N2_S[_nft]._wnft>0){
        _nft = _N2_S[_nft]._wnft;
      }
      if(_type==1){

        require(IERC1155(address(this)).balanceOf(burn,_nft)>0,'this vault is active');

      }else{

        uint time = block.timestamp + 7 * 1095 days;
        require(time>block.timestamp,'this is not expired');

      }
      require(IERC1155(address(this)).balanceOf(msg.sender,_toNFT)>0, ' you do not own this nft');

      _N2_S[_toNFT] = _N2_S[_nft];
      _V2_N[_contract] = _toNFT;
      _N2_V[_toNFT] = _contract;
      _N2_V[_nft] = burn;

    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
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
