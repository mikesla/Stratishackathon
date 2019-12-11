using System;
using System.Collections.Generic;
using System.Text;

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


    public class TestSmartContractState : ISmartContractState
    {
        public TestSmartContractState(
            IBlock block,
            IMessage message,
            IPersistentState persistentState,
            ISerializer serializer,
            IGasMeter gasMeter,
            IInternalTransactionExecutor transactionExecutor,
            Func<ulong> getBalance,
            IInternalHashHelper hashHelper,
            IContractLogger contractLogger
            )
        {
            this.Block = block;
            this.Message = message;
            this.PersistentState = persistentState;
            this.Serializer = serializer;
            this.GasMeter = gasMeter;
            this.InternalTransactionExecutor = transactionExecutor;
            this.GetBalance = getBalance;
            this.InternalHashHelper = hashHelper;
            this.ContractLogger = contractLogger;
         
        }

        public IBlock Block { get; }

        public IMessage Message { get; }

        public IPersistentState PersistentState { get; }
        public ISerializer Serializer { get; }
        public IGasMeter GasMeter { get; }
        public IInternalTransactionExecutor InternalTransactionExecutor { get; }
        public Func<ulong> GetBalance { get; }
        public IInternalHashHelper InternalHashHelper { get; }
        public IContractLogger ContractLogger { get; }
        public Func<Address, ulong, ITransferResult> Transfer { get; }
    }


    public class TestTransferResult : ITransferResult
    {
        public object ReturnValue { get => null; }
        public bool Success { get => true; }
        public void Transfer(Address addressTo, ulong amountToTransfer) { }
    }

    public class TestContractLogger : IContractLogger
    {
        public void Log<T>(ISmartContractState smartContractState, T toLog)
            where T : struct
        { 
        }
     
    }

    public class TestBlock : IBlock
    {
        public Address Coinbase { get; set; }

        public ulong Number { get; set; }
    }

    public class TestMessage : IMessage
    {
        public Address ContractAddress { get; set; }

        public Address Sender { get; set; }

        public ulong Value { get; set; }
    }

    public class TestPersistentState : IPersistentState
    {
        private Dictionary<string, object> objects = new Dictionary<string, object>();

        private T GetObject<T>(string key)
        {
            if (this.objects.ContainsKey(key))
                return (T)this.objects[key];

            return default(T);
        }

        public bool IsContract(Address address)
        {
            throw new NotImplementedException();
        }

        public byte[] GetBytes(byte[] key)
        {
            throw new NotImplementedException();
        }

        public byte[] GetBytes(string key)
        {
            return this.GetObject<byte[]>(key);
        }

        public char GetChar(string key)
        {
            return this.GetObject<char>(key);
        }

        public Address GetAddress(string key)
        {
            return this.GetObject<Address>(key);
        }

        public bool GetBool(string key)
        {
            return this.GetObject<bool>(key);
        }

        public int GetInt32(string key)
        {
            return this.GetObject<int>(key);
        }

        public uint GetUInt32(string key)
        {
            return this.GetObject<uint>(key);
        }

        public long GetInt64(string key)
        {
            return this.GetObject<long>(key);
        }

        public ulong GetUInt64(string key)
        {
            return this.GetObject<ulong>(key);
        }

        public string GetString(string key)
        {
            return this.GetObject<string>(key);
        }

        public T GetStruct<T>(string key) where T : struct
        {
            return this.GetObject<T>(key);
        }

        public T[] GetArray<T>(string key)
        {
            throw new NotImplementedException();
        }

        public void SetBytes(byte[] key, byte[] value)
        {
            throw new NotImplementedException();
        }

        private void SetObject<T>(string key, T obj)
        {
            this.objects[key] = obj;
        }

        public void SetBytes(string key, byte[] value)
        {
            this.SetObject(key, value);
        }

        public void SetChar(string key, char value)
        {
            this.SetObject(key, value);
        }

        public void SetAddress(string key, Address value)
        {
            this.SetObject(key, value);
        }

        public void SetBool(string key, bool value)
        {
            this.SetObject(key, value);
        }

        public void SetInt32(string key, int value)
        {
            this.SetObject(key, value);
        }

        public void SetUInt32(string key, uint value)
        {
            this.SetObject(key, value);
        }

        public void SetInt64(string key, long value)
        {
            this.SetObject(key, value);
        }

        public void SetUInt64(string key, ulong value)
        {
            this.SetObject(key, value);
        }

        public void SetString(string key, string value)
        {
            this.SetObject(key, value);
        }

        public void SetStruct<T>(string key, T value) where T : struct
        {
            this.SetObject(key, value);
        }

        public void SetArray(string key, Array a)
        {
            throw new NotImplementedException();
        }

        public void Clear(string key)
        {
            throw new NotImplementedException();
        }
    }
}
