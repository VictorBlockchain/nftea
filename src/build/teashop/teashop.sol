// File: @openzeppelin/contracts/token/ERC20/IERC20.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
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
    function setIsWalletLimitExempt(address _holder, bool exempt ) external;
}

// File: @openzeppelin/contracts/utils/introspection/IERC165.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
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

// File: @openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol



pragma solidity ^0.8.0;


/**
 * @dev _Available since v3.1._
 */
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

// File: @openzeppelin/contracts/token/ERC1155/IERC1155.sol



pragma solidity ^0.8.0;


/**
 * @dev Required interface of an ERC1155 compliant contract, as defined in the
 * https://eips.ethereum.org/EIPS/eip-1155[EIP].
 *
 * _Available since v3.1._
 */
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

    function setPower(address _user,uint256 _power, uint256 _type) external returns (bool);
    function getTEAPOT(uint256 _nft) external returns(address);
    function setVOLUME(uint256 _nft, uint256 _value) external returns(bool);
    function setFLOOR(uint256 _nft, uint256 _value) external returns(bool);
    function _N2_V(uint256 _nft) external returns(address);
    function getIPFS(uint256 _nft) external returns(string memory);
    function getVault(uint256 _nft) external returns(address, uint256);
    function getADDRESSES() external returns(address,address,address,address,address,address,address,address);

}

// File: contracts/TeaShop.sol

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;


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


contract TEA_SHOP {

  using SafeMath for uint256;

    event bidPlaced(
        address _seller,
        address _bidder,
        uint256 _nft
    );
    event auctionListed(
        address _seller,
        uint256 _nft,
        uint256 _market
    );
    event saleMade(
        address _seller,
        uint256 _nft
    );
    event auctionClosed(

        address _seller,
        address _buyer,
        uint256 _nft
    );
    event auctionPaid(

        address _seller,
        address _buyer,
        uint256 _nft
    );
    event royaltyPaid(

        address _creator,
        uint256 _nft
    );
    event bidAccepted(
        address _seller,
        address _buyer,
        uint256 _nft
        );
    event bidDeny(
        address _seller,
        address _buyer,
        uint256 _nft
        );

        struct AUCTION {

          uint256 id;
          uint256 quantity;
          uint256 royalty;
          uint256 auctionEnd;
          uint256 minPrice;
          uint256 buyNowPrice;
          uint256 bidQuantity;
          uint256 highestBid;
          address highestBidder;
          address seller;
          address nftCreator;
          address[] partners;
          uint256[] sips;
          uint256 status;
          address[] taxPartners;
          uint256[] taxSips;
          uint256 nft;
          uint256 market;

        }
        AUCTION[] public auctions;

        struct SHOP{

          uint256 id;
          address owner;
          string name;
          uint32 active;
          uint256 rating;
          address[] taxPartners;
          uint256[] taxSips;

        }

  mapping(uint256=>AUCTION) public auction;
  mapping(uint256=>mapping(address=>AUCTION)) public nftToHostToAuction;
  mapping(uint256=>SHOP) public idToShop;
  mapping(address=>SHOP) public ownerToShop;
  mapping(uint256=>address[]) public nftToBidders;
  mapping(address=>mapping(uint256=>mapping(address=>uint256))) public biddersToNFTtoBid;
  mapping(uint256=>address) public shopToOwner;
  mapping(address=>uint256[]) public buyerToNFTsBought;
  mapping(address=>uint256[]) public sellerTONFTsSold;
  mapping(address=>uint256[]) public sellerToAuctions;
  mapping(address=>bool) public isAdmin;
  mapping(address=>bool) public BANNED;
  mapping(address=>mapping(uint256=>uint256)) public userToShopToRating;
  mapping(uint256=>uint256[]) public shopToRatings;
  mapping(uint256=>mapping(address=>uint256)) public nftToBidTime;
  mapping(uint256=>bool) public payBidBonus;
  mapping(uint256=>mapping(address=>mapping(address=>bool))) public nftToHostToBidderAccepted;
  mapping(uint256=>uint256[]) public marketToAuctions;
  mapping(uint256=>address) public auctionToHost;
  mapping(uint256=>uint256) public auctionToNFT;
  mapping(uint256=>mapping(uint256=>uint256)) public marketToAuctionsIndex;
  mapping(address=>mapping(uint256=>uint256)) public sellerToAuctionsIndex;

  uint256 auctionId;
  uint256 shopId;
  uint BIDFEE =1;
  uint  AUCTIONFEE =1;

  address public TOKEN;
  address public NFTEA;
  address public TEAPOT;
  address public FEEADDRESS;
  address public TEAPASS;
  address public ALBUM;

  constructor(address _nftea){

    NFTEA = _nftea;
    auctionId = 0;
    shopId = 0;
    isAdmin[msg.sender] = true;

  }

  receive () external payable {}

  function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

  function SET_ADMIN(address _admin) public{

    require(isAdmin[msg.sender], 'you are not an admin');

    if(isAdmin[_admin]){
      isAdmin[_admin] = false;
    }else{
      isAdmin[_admin] = true;
    }
  }

  function adminStopAuction(uint256 _nft, address _host) public {
    require(isAdmin[msg.sender], 'you are not an admin');

    nftToHostToAuction[_nft][_host].status = 4;
    auction[nftToHostToAuction[_nft][_host].status = 4;
    auction[auction[nftToHostToAuction[_nft][_host].id].status = 4;
    if(nftToHostToAuction[_nft][_host].highestBidder!=nftToHostToAuction[_nft][_host].seller){

      IERC20(TOKEN).transferFrom(nftToHostToAuction[_nft][_host].highestBidder,address(this), nftToHostToAuction[_nft][_host].highestBid);
      IERC1155(NFTEA).safeTransferFrom(address(this),nftToHostToAuction[_nft][_host].seller,_nft,nftToHostToAuction[_nft][_host].quantity,'');

    }

  }
  function setAddress() public {

      require(isAdmin[msg.sender], 'you are not an admin');

      (address _token,,address _teapot,address _teapass,,address _fees,address _album, address _nftea) = IERC1155(NFTEA).getADDRESSES();

      TEAPASS = _teapass;
      TEAPOT = _teapot;
      TOKEN = _token;
      FEEADDRESS = _fees;
      ALBUM = _album;
      if(_nftea!=NFTEA){
        NFTEA = _nftea;
      }


  }
  function setNFTEA(address _nftea) public {
    require(isAdmin[msg.sender], 'you are not that cool');
    NFTEA = _nftea;

  }
  function SET_FEES(uint32 _NFTEABidFee, uint32 _auctionFee) public{

    require(isAdmin[msg.sender], 'you are not an admin');
    BIDFEE = _NFTEABidFee;
    AUCTIONFEE = _auctionFee;

  }

  function GET_BALANCE(address _user, uint256 _nft) public view returns(uint256){

    return IERC1155(NFTEA).balanceOf(_user,_nft);

  }

  function SET_AUCTION(uint256 _nft,uint256 _buyNowPrice, uint256 _minPrice, address[] memory _partners, uint256[] memory _sips, uint256 _quantity, uint256 _royalty,address[] memory _taxPartners, uint256[] memory _taxSips, address _nftCreator,uint256 _market) public{

    require(IERC1155(NFTEA).balanceOf(msg.sender,_nft)>=_quantity, 'you do not own than many nfts');

    auctionId = SafeMath.add(auctionId,1);

    AUCTION memory save = AUCTION({

      id:auctionId,
      auctionEnd: block.timestamp + 30 days,
      minPrice: _minPrice,
      buyNowPrice: _buyNowPrice,
      highestBid: _minPrice,
      bidQuantity:0,
      quantity:_quantity,
      highestBidder: msg.sender,
      seller:msg.sender,
      partners: _partners,
      sips: _sips,
      status: 1,
      royalty: _royalty,
      taxPartners: _taxPartners,
      taxSips: _taxSips,
      nftCreator: _nftCreator,
      nft:_nft,
      market:_market

    });
    auction[auctionId] = save;
    nftToHostToAuction[_nft][msg.sender] = save;
    marketToAuctions[_market].push(auctionId);
    marketToAuctionsIndex[_market][auctionId] = marketToAuctions[_market].length - 1;
    sellerToAuctions[msg.sender].push(auctionId);
    sellerToAuctionsIndex[msg.sender][auctionId] = sellerToAuctions[msg.sender].length -1;
    auctionToHost[auctionId] = msg.sender;
    auctionToNFT[auctionId] = _nft;
    IERC1155(NFTEA).safeTransferFrom(msg.sender,address(this),_nft,_quantity,'');
    IERC1155Receiver(address(this)).onERC1155Received(NFTEA,msg.sender,_nft,_quantity,'');
    if(_quantity==1){
      payBidBonus[_nft] = true;
    }
    emit auctionListed(msg.sender,_nft,_market);

  }

  function GET_AUCTION(uint256 _nft,address _host) public returns(AUCTION memory, string memory, bool, address, uint256){

    string memory ipfs = IERC1155(NFTEA).getIPFS(_nft);
    (address _vault, uint256 brewdate) = IERC1155(TEAPOT).getVault(_nft);
    return (nftToHostToAuction[_nft][_host],ipfs, nftToHostToBidderAccepted[_nft][_host][nftToHostToAuction[_nft][_host].highestBidder],_vault,brewdate);

  }

  function GET_HOST_AUCTIONS(address _host) public view returns(uint256[] memory){

    return sellerToAuctions[_host];

  }

  function GET_AUCTIONS(uint256 _market) public view returns(uint256[] memory){

    return marketToAuctions[_market];

  }

  function SET_SHOP(string memory name, address[] memory taxPartners, uint256[] memory taxSips) public{

    require(!BANNED[msg.sender],'you are banned');
    shopId = SafeMath.add(shopId,1);
    SHOP memory save = SHOP({
      id:shopId,
      owner:msg.sender,
      name:name,
      active:1,
      rating:0,
      taxPartners: taxPartners,
      taxSips:taxSips
    });

    shopToOwner[shopId]= msg.sender;
    ownerToShop[msg.sender] = save;
    idToShop[shopId] = save;

  }

  function GET_SHOP(uint256 _shop, address _owner) public view returns(SHOP memory){

    if(_shop>0){

    return idToShop[_shop];

    }else{
        return ownerToShop[_owner];
    }
  }

  function DELETE_SHOP(uint256 _shop) public{

    require(ownerToShop[msg.sender].id==_shop,'You did not on this shop');

    ownerToShop[msg.sender].active = 0;

  }

  function SET_BID(uint256 _nft, address _host, uint256 _value, uint256 _quantity) public{

    uint256 _valueOG = _value.mul(_quantity);

    require(nftToHostToAuction[_nft][_host].status==1, 'this auction is not active');
    require(nftToHostToAuction[_nft][_host].highestBidder!=msg.sender,'You are already the highest bidder');
    require(msg.sender!=nftToHostToAuction[_nft][_host].seller,'cannot bid on your own auction');
    require(nftToHostToAuction[_nft][_host].minPrice<_value,'bid too low');
    require(nftToHostToAuction[_nft][_host].highestBid<_value, 'bid too low');
    require(nftToHostToAuction[_nft][_host].quantity.sub(_quantity)>=0, 'no more left');

    uint256 _fee = _value.mul(BIDFEE).div(100);
    _value = _value.sub(_fee);

    IERC20(TOKEN).transferFrom(msg.sender,address(this), _value);
    if(payBidBonus[_nft]){

      address _contract = IERC1155(TEAPOT)._N2_V(_nft);
      IERC20(TOKEN).transferFrom(msg.sender,_contract, _fee);
      require(checkSuccess(), "BID bonus transfer failed");

    }else{

      IERC20(TOKEN).transferFrom(msg.sender,TEAPOT, _fee);
      require(checkSuccess(), "BID bonus transfer failed");

    }

    if(_valueOG>=nftToHostToAuction[_nft][_host].buyNowPrice){

      SET_PAYOUT(_nft,_value,_host);
      IERC1155(NFTEA).safeTransferFrom(address(this),msg.sender,_nft,_quantity,'');
      require(checkSuccess(), "NFT buy now failed");

      if(nftToHostToAuction[_nft][_host].highestBidder!=nftToHostToAuction[_nft][_host].seller){
        //refund previous bidder
        IERC20(TOKEN).transfer(nftToHostToAuction[_nft][_host].highestBidder, nftToHostToAuction[_nft][_host].highestBid);
        require(checkSuccess(), "bid refund transfer failed");
      }

      nftToHostToAuction[_nft][_host].highestBidder = msg.sender;
      nftToHostToAuction[_nft][_host].highestBid = _value;
      if(nftToHostToAuction[_nft][_host].minPrice>0){

        nftToHostToAuction[_nft][_host].buyNowPrice = nftToHostToAuction[_nft][_host].buyNowPrice.mul(2);

      }
      biddersToNFTtoBid[msg.sender][_nft][_host] = _value;
      nftToBidders[_nft].push(msg.sender);
      nftToBidTime[_nft][_host] = block.timestamp;
      nftToHostToAuction[_nft][_host].bidQuantity = _quantity;
      nftToHostToAuction[_nft][_host].quantity = nftToHostToAuction[_nft][_host].quantity.sub(_quantity);
      emit saleMade(nftToHostToAuction[_nft][_host].seller,_nft);

    }else{
        //refund previous bidder

        if(nftToHostToAuction[_nft][_host].highestBidder!=nftToHostToAuction[_nft][_host].seller){

            IERC20(TOKEN).transfer(nftToHostToAuction[_nft][_host].highestBidder, nftToHostToAuction[_nft][_host].highestBid);
            require(checkSuccess(), "bid refund transfer failed");
        }
        nftToHostToAuction[_nft][_host].highestBidder = msg.sender;
        nftToHostToAuction[_nft][_host].highestBid = _value;
        nftToBidders[_nft].push(msg.sender);
        biddersToNFTtoBid[msg.sender][_nft][_host] = _value;
        nftToBidTime[_nft][_host] = block.timestamp;
        nftToHostToAuction[_nft][_host].bidQuantity = _quantity;
        nftToHostToAuction[_nft][_host].quantity = nftToHostToAuction[_nft][_host].quantity.sub(_quantity);
        emit bidPlaced(nftToHostToAuction[_nft][_host].seller,msg.sender,_nft);
    }
  }
  function GET_BID_ACCEPTED(uint256 _nft, address _host, address _bidder) public view returns(bool){

    return nftToHostToBidderAccepted[_nft][_host][_bidder];

  }

  function DENYBID(uint256 _nft, address _host) public {

    require(nftToHostToAuction[_nft][_host].seller==msg.sender, 'you are not the auction host');
    IERC20(TOKEN).transfer(nftToHostToAuction[_nft][_host].highestBidder, nftToHostToAuction[_nft][_host].highestBid);
    require(checkSuccess(), "bid refund transfer failed");
    nftToHostToAuction[_nft][_host].highestBidder = msg.sender;
    nftToHostToAuction[_nft][_host].highestBid = nftToHostToAuction[_nft][_host].minPrice;
    emit bidDeny(msg.sender,nftToHostToAuction[_nft][_host].highestBidder,_nft);

  }

  function END_AUCTION(uint256 _nft,uint256 _type, address _host) public {

    if(_type==1){

    require(nftToHostToAuction[_nft][_host].seller==msg.sender, 'you are not the auction host');


    if(nftToHostToAuction[_nft][_host].highestBidder!=nftToHostToAuction[_nft][_host].seller){

         SET_PAYOUT(_nft,nftToHostToAuction[_nft][_host].highestBid,_host);
         buyerToNFTsBought[nftToHostToAuction[_nft][_host].highestBidder].push(_nft);
         sellerTONFTsSold[nftToHostToAuction[_nft][_host].seller].push(_nft);
         emit bidAccepted(nftToHostToAuction[_nft][_host].seller,nftToHostToAuction[_nft][_host].highestBidder,_nft);

    }else{

      IERC1155(NFTEA).safeTransferFrom(address(this),msg.sender,_nft,nftToHostToAuction[_nft][_host].quantity,'');
      require(checkSuccess(), "End auction transfer failed");
      nftToHostToAuction[_nft][_host].status = 3;
      auction[nftToHostToAuction[_nft][_host].id].status = 3;
      auction[auction[nftToHostToAuction[_nft][_host].id].status = 3;
      delete sellerToAuctions[_host][sellerToAuctionsIndex[_host][nftToHostToAuction[_nft][_host].id]];
      delete marketToAuctions[nftToHostToAuction[_nft][_host].market][marketToAuctionsIndex[nftToHostToAuction[_nft][_host].market][nftToHostToAuction[_nft][_host].id]];
      emit auctionClosed(msg.sender,nftToHostToAuction[_nft][_host].highestBidder,_nft);

     }
    }else{

        require(nftToHostToAuction[_nft][_host].highestBidder==msg.sender, 'you are not the highest bidder');
        require(nftToHostToAuction[_nft][_host].auctionEnd<block.timestamp,'Auction is not over');
        SET_PAYOUT(_nft,nftToHostToAuction[_nft][_host].highestBid,_host);
        buyerToNFTsBought[nftToHostToAuction[_nft][_host].highestBidder].push(_nft);
        sellerTONFTsSold[nftToHostToAuction[_nft][_host].seller].push(_nft);
    }

  }

 function UPDATE_AUCTION(uint256 _nft, uint32 _minPrice, uint32 _buyNowPrice) public{

    require(nftToHostToAuction[_nft][msg.sender].seller==msg.sender,'You did not create this auction');
    require(nftToHostToAuction[_nft][msg.sender].highestBidder!=nftToHostToAuction[_nft][msg.sender].seller,'a bid was placed');
    if(nftToHostToAuction[_nft][msg.sender].highestBidder==nftToHostToAuction[_nft][msg.sender].seller){
      nftToHostToAuction[_nft][msg.sender].minPrice = _minPrice;
    }
    nftToHostToAuction[_nft][msg.sender].buyNowPrice = _buyNowPrice;

  }

  function SET_PAYOUT(uint256 _nft, uint256 _amount, address _host) internal returns(bool){

    uint256 quantity = nftToHostToAuction[_nft][_host].bidQuantity;
    uint256 _value = _amount;
    uint royalty;

    ///pay taxes
    for (uint256 i = 0; i<nftToHostToAuction[_nft][_host].taxPartners.length; i++){

      if(nftToHostToAuction[_nft][_host].taxSips[i]>0){

        uint256 tax =  _value.mul(nftToHostToAuction[_nft][_host].taxSips[i]).div(100);
        _value = _value.sub(tax);
        PAY(_nft,nftToHostToAuction[_nft][_host].taxPartners[i],tax);
      }
    }

    if(nftToHostToAuction[_nft][_host].seller==nftToHostToAuction[_nft][_host].nftCreator){

      ///split value among partners
      for (uint256 i = 0; i<nftToHostToAuction[_nft][_host].partners.length; i++){

        if(nftToHostToAuction[_nft][_host].sips[i]>0){
        royalty = _value.mul(nftToHostToAuction[_nft][_host].sips[i]).div(100);
        _value = _value.sub(royalty);
        PAY(_nft,nftToHostToAuction[_nft][_host].partners[i],royalty);
        }
      }

    }else{

      ///pay royalties only
      uint256 royaltyValue = _value.mul(nftToHostToAuction[_nft][_host].royalty).div(100);

      for (uint256 i = 0; i<nftToHostToAuction[_nft][_host].sips.length; i++){
        if(nftToHostToAuction[_nft][_host].sips[i]>0){
            royalty = royaltyValue.mul(nftToHostToAuction[_nft][_host].sips[i]).div(100);
            _value = _value.sub(royalty);
            PAY(_nft,nftToHostToAuction[_nft][_host].partners[i],royalty);
            if(nftToHostToAuction[_nft][_host].sips[i]==0){
                emit royaltyPaid(nftToHostToAuction[_nft][_host].nftCreator,_nft);
            }
        }

      }
      //pay seller
      PAY(_nft,nftToHostToAuction[_nft][_host].seller,_value);

    }
      address buyer = nftToHostToAuction[_nft][_host].highestBidder;
      if(buyer==nftToHostToAuction[_nft][_host].seller){
        buyer = msg.sender;
      }
      IERC1155(NFTEA).safeTransferFrom(address(this),buyer,_nft,quantity,'');
      IERC1155(TEAPASS).setPower(buyer,5000,1);
      IERC1155(TEAPASS).setPower(nftToHostToAuction[_nft][_host].seller,2500,1);
      IERC20(TOKEN).setIsWalletLimitExempt(buyer,true);
      nftToHostToBidderAccepted[_nft][_host][buyer] = true;
      if(nftToHostToAuction[_nft][_host].quantity.sub(1)<1){
        nftToHostToAuction[_nft][_host].status = 2;
        auction[nftToHostToAuction[_nft][_host].id].status = 2;
        auction[auction[nftToHostToAuction[_nft][_host].id].status = 2;
        nftToHostToAuction[_nft][_host].auctionEnd = block.timestamp;
        delete sellerToAuctions[_host][sellerToAuctionsIndex[_host][nftToHostToAuction[_nft][_host].id]];
        delete marketToAuctions[nftToHostToAuction[_nft][_host].market][marketToAuctionsIndex[nftToHostToAuction[_nft][_host].market][nftToHostToAuction[_nft][_host].id]];

        emit auctionClosed(msg.sender,buyer,_nft);

      }else{

        emit auctionPaid(msg.sender,buyer,_nft);
      }
      return true;
  }

  function PAY(uint256 _nft, address payTo, uint256 _value) internal returns(bool){

    IERC20(TOKEN).transfer(payTo, _value);
    require(checkSuccess(), "PAY failed");
    IERC1155(ALBUM).setVOLUME(_nft,_value);
    IERC1155(ALBUM).setFLOOR(_nft,_value);
    return true;
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
