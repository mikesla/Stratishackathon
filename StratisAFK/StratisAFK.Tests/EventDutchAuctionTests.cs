using System;
using Moq;
using Stratis.SmartContracts.Networks;
using Stratis.SmartContracts.CLR;


using System.Collections.Generic;
using Stratis.SmartContracts.CLR.Serialization;
using Stratis.SmartContracts.Networks;
using Stratis.SmartContracts.RuntimeObserver;
using Xunit;
using Stratis.SmartContracts;
using Stratis.SmartContracts.CLR.Compilation;
using Stratis.SmartContracts.CLR.Loader;
using System.Runtime.Loader;
using Stratis.SmartContracts.CLR.Decompilation;
using CSharpFunctionalExtensions;

namespace StratisAFK.Tests
{
    public class EventDutchAuctionTests
    {




        private readonly Address TestAddress,ta2,ta3,ta4,ta5;
        private TestSmartContractState smartContractState;
        private const ulong Balance = 0;
        private const ulong GasLimit = 10000;
        private const ulong Value = 0;
        EventDutchAuction contract;
   
        public EventDutchAuctionTests()
        {
                        var network = new SmartContractsRegTest();

            this.TestAddress = "0x0000000000000000000000000000000000000001".HexToAddress();
            this.ta2 = "0x0000000000000000000000000000000000000002".HexToAddress();
            this.ta3 = "0x0000000000000000000000000000000000000003".HexToAddress();
            this.ta4 = "0x0000000000000000000000000000000000000004".HexToAddress();
            this.ta5 = "0x0000000000000000000000000000000000000005".HexToAddress();
            var block = new TestBlock
            {
                Coinbase = this.TestAddress,
                Number = 1
            };
            var message = new TestMessage
            {
                ContractAddress = this.TestAddress,
                Sender = this.TestAddress,
                Value = Value
            };
            var getBalance = new Func<ulong>(() => Balance);
            var persistentState = new TestPersistentState();
            var serializer = new Serializer(new ContractPrimitiveSerializer(network));
            this.smartContractState = new TestSmartContractState(
                block,
                message,
                persistentState,
                serializer,
                null,
                null,
                getBalance,
                null,
                null
            );
            ulong totalSupply = 1000_000; string name = "TestToken"; string symbol = "TST";
            this.contract = new EventDutchAuction(this.smartContractState);
        }


        [Fact]
        public void TestAuction()
        {


            //-------------------------------------------------------

            ((TestMessage)this.smartContractState.Message).Value = 102;
            ((TestMessage)this.smartContractState.Message).Sender = ta2;
            ((TestBlock)this.smartContractState.Block).Number = 1;
            var sdf = this.contract.GetCurrentPrice();
            ((TestBlock)this.smartContractState.Block).Number = 2000;
            var asf  = this.contract.GetCurrentPrice();


            var dsfa = this.contract.AddressBidded;
            var dsfas =this.contract.TicketIdByAddress;
            this.contract.BuyTicket();
          

            ((TestMessage)this.smartContractState.Message).Value = 20;
            ((TestMessage)this.smartContractState.Message).Sender = ta3;
            this.contract.BuyTicket();

            ((TestMessage)this.smartContractState.Message).Value = 30;
            ((TestMessage)this.smartContractState.Message).Sender = ta4;
            this.contract.BuyTicket();

            //((TestMessage)this.smartContractState.Message).Value = 50;
            //((TestMessage)this.smartContractState.Message).Sender = ta5;
            //this.contract.BuyTicket();

            //var sdaf = 253;
            ((TestMessage)this.smartContractState.Message).Value = 20;
            ((TestMessage)this.smartContractState.Message).Sender = ta3;
            this.contract.GetOverbid();

   


        }
    }
}
