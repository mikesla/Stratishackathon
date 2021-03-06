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

namespace StratisAFK.Tests
{
    public class StandardTokenTests
    {
        private readonly Address TestAddress,ta2,ta3,ta4,ta5;
        private TestSmartContractState smartContractState;
        private const ulong Balance = 0;
        private const ulong GasLimit = 10000;
        private const ulong Value = 0;
        StandardToken contract;
        public StandardTokenTests()
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
            this.contract = new StandardToken(this.smartContractState, totalSupply, name, symbol);

        }


        [Fact]
        public void TestBidding()
        {

            this.contract.TransferTo(this.ta2, 1000);


            var asf = this.contract.GetBalance(this.TestAddress);

            this.contract.TransferTo(this.ta3, 1000);


            var asf3 = this.contract.GetBalance(this.TestAddress);


            this.contract.TransferTo(this.ta4, 1000);


            var as4f = this.contract.GetBalance(this.TestAddress);



            var asf679 = this.contract.GetBalance(this.ta2);
        }


    }



}
