using System;
using System.Collections.Generic;
using System.Text;
using Stratis.SmartContracts;

public class EventDutchAuction : SmartContract
{



    public EventDutchAuction(ISmartContractState state) : base(state)
    {
        TotalSupply = 0;
        ContractOwner = Message.Sender;
        AuctionStartBlock = 1;
        AuctionEndBlock = 5000;
        EndPrice = 2*10^8;
        MaxPrice = 10*10^8;
        TicketsAmount = 3;

    }



    public ulong BalanceOf(Address owner)
    {
        return PersistentState.GetUInt64($"Total:{owner}");
    }



    public ulong GetContractBalance
    {
        get => this.Balance;
    }

    /// <inheritdoc />
    public ulong TotalSupply
    {
        get => PersistentState.GetUInt64(nameof(this.TotalSupply));
        private set => PersistentState.SetUInt64(nameof(this.TotalSupply), value);
    }

    /// <inheritdoc />
    public ulong TicketsAmount
    {
        get => PersistentState.GetUInt64(nameof(this.TicketsAmount));
        private set => PersistentState.SetUInt64(nameof(this.TicketsAmount), value);
    }


    /// <inheritdoc />
    public ulong EndPrice
    {
        get => PersistentState.GetUInt64(nameof(this.EndPrice));
        private set => PersistentState.SetUInt64(nameof(this.EndPrice), value);
    }


    public ulong MaxPrice
    {
        get => PersistentState.GetUInt64(nameof(this.MaxPrice));
        private set => PersistentState.SetUInt64(nameof(this.MaxPrice), value);
    }

    /// <inheritdoc />
    public ulong AuctionStartBlock
    {
        get => PersistentState.GetUInt64(nameof(this.AuctionStartBlock));
        private set => PersistentState.SetUInt64(nameof(this.AuctionStartBlock), value);
    }


    public ulong AuctionEndBlock
    {
        get => PersistentState.GetUInt64(nameof(this.AuctionEndBlock));
        private set => PersistentState.SetUInt64(nameof(this.AuctionEndBlock), value);
    }

    public ulong AuctionMinPriceBlock
    {
        get => PersistentState.GetUInt64(nameof(this.AuctionMinPriceBlock));
        private set => PersistentState.SetUInt64(nameof(this.AuctionMinPriceBlock), value);
    }


    /// <inheritdoc />
    public Address ContractOwner
    {
        get => PersistentState.GetAddress(nameof(this.ContractOwner));
        private set => PersistentState.SetAddress(nameof(this.ContractOwner), value);
    }



    /// <inheritdoc />
    public ulong TicketIdByAddress
    {
        get => PersistentState.GetUInt64($"TicketIds[{Message.Sender}]");
        private set => PersistentState.SetUInt64($"TicketIds[{Message.Sender}]", value);
    }



    /// <inheritdoc />
    public bool AddressBidded
    {
        get => PersistentState.GetBool($"AddressBidded[{Message.Sender}]");
        private set => PersistentState.SetBool($"AddressBidded[{Message.Sender}]", value);
    }





    private void SetBalance(Address address, ulong balance)
    {
        PersistentState.SetUInt64($"Balance:{address}", balance);
    }

    public Address OwnerOf(ulong tokenId)
    {
        return PersistentState.GetAddress($"Token{tokenId}");
    }


    public bool IsEnded()
    {
        return Block.Number > AuctionEndBlock;
    }

    private void SetOwner(ulong tokenId, Address address)
    {
        TicketNew tc = new TicketNew();
        tc.value = Message.Value;
        tc.checkedIn = false;
        tc.overbidReturned = false;
        tc.bidderAddress = address;

        PersistentState.SetStruct<TicketNew>($"Token{tokenId}", tc);
        TotalSupply++;
        //PersistentState.SetAddress($"Token{tokenId}", address);
    }




    //100 00 000 000


    public bool GetTicketCheckIn()
    {

        return PersistentState.GetStruct<TicketNew>($"Token{TicketIdByAddress}").checkedIn;

    }

    public ulong GetTicketBid()
    {

        return PersistentState.GetStruct<TicketNew>($"Token{TicketIdByAddress}").value;

    }
    public bool GetTicketOverbidReturned()
    {
        
        return PersistentState.GetStruct<TicketNew>($"Token{TicketIdByAddress}").overbidReturned;

    }

    private TicketNew  GetTicket()
    {
        return PersistentState.GetStruct<TicketNew>($"Token{TicketIdByAddress}");

    }

    private  TicketNew GetTicket(ulong tokenId)
    {
        return PersistentState.GetStruct<TicketNew>($"Token{tokenId}");

    }


    private void SetTicketOverbidReturned(ulong tokenId)
    {

        var tc = GetTicket(tokenId);
        tc.overbidReturned = true;
        PersistentState.SetStruct<TicketNew>($"Token{tokenId}", tc);


    }


    public ulong GetCurrentPrice()

    {
        ulong blocksPassed = Block.Number - AuctionStartBlock;
        ulong currentPrice = MaxPrice -  (blocksPassed * (MaxPrice  - EndPrice)*AuctionEndBlock / (AuctionEndBlock- AuctionStartBlock))/ AuctionEndBlock;
        return currentPrice;
    }


    public void DistributeOverbids(ulong fromBid, ulong toBid)

    {
        Assert(fromBid <= toBid, "bids window should be correct");
        if (TicketsAmount <= toBid)
            toBid = TicketsAmount;

        for (ulong i = fromBid; i < toBid; i++)
        {
            GetOverbid(i);
        }


    }

    private void GetOverbid(ulong ticketId)
    {
       
        var ticket = GetTicket(ticketId);
        Assert(!ticket.overbidReturned , "t");
        ticket.overbidReturned = true;
        var amountReturned = ticket.value - EndPrice;
        SetTicketOverbidReturned(ticketId);
        Transfer(ticket.bidderAddress, amountReturned);
        Transfer(ContractOwner, EndPrice);
   }

    public void BuyTicket()

    {
        Assert(!AddressBidded, "Only one ticket by address is allowed");
        Assert(Message.Value >= GetCurrentPrice(), "bid less than current price");
        Assert(TicketsAmount > 0, "sold out");


        ulong bidId = TotalSupply + 1;
        //membersTickets.push(Ticket(msg.value, msg.sender, false, false));
        Mint(bidId, Message.Sender);
        TicketIdByAddress = bidId;
        AddressBidded = true;
        TicketsAmount--;
        //ticketsFunds = ticketsFunds.add(msg.value);
        //ticketsAmount = ticketsAmount.sub(1);

        if (TicketsAmount == 0)
        {
           // auctionEnd = block.timestamp; // solium-disable-line security/no-block-members
            EndPrice = GetCurrentPrice();
        }

        //emit TicketBid(bidId, msg.sender, msg.value);
    }

    private void Mint(ulong tokenId, Address address)
    {
        SetOwner(tokenId, address);
    }



    /// <summary>
    /// Note that this does not check the receiver is able to use the token (in case they are a contract without the necessary interface)
    /// </summary>
    public void TransferFrom(Address from, Address to, ulong tokenId)
    {
        Assert(Message.Value == 0); // Don't want to lose any funds
        Assert(from == Message.Sender); // Until we implement approved list
        Assert(OwnerOf(tokenId) == Message.Sender);
        Assert(from != to);

        AddTokenTo(to, tokenId);
        RemoveTokenFrom(from);

        Log(new Transfer { From = from, To = to, TokenId = tokenId });
    }

    private void AddTokenTo(Address to, ulong tokenId)
    {
        SetBalance(to, BalanceOf(to) + 1);
        SetOwner(tokenId, to);
    }

    private void RemoveTokenFrom(Address from)
    {
        SetBalance(from, BalanceOf(from) - 1);
    }

    public struct Transfer
    {
        [Index]
        public ulong TokenId;

        [Index]
        public Address From;

        [Index]
        public Address To;
    }

    public struct TicketNew
    {
        public ulong value;
        public Address bidderAddress;
        public bool checkedIn;
        public bool overbidReturned;
    }




}

