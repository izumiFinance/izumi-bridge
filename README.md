# izumi contracts


<div align="center">
  <a href="http://izumi.finance"> <img width="250px" height="auto" 
    src="assets/logo.png"></a>
</div>

---


This Repo contains the most contracts used in izumi, supportted by [Truffle](https://www.trufflesuite.com/docs/truffle/quickstart).


### Steps to deloy contracts on certain blockchains.

1. Compile:
``` shell
$ trffule compile
```

2. Deploy:
``` shell
$ trffule migrate --network XXXNet
```

Current supportted nets: 'BSC' ,'BSCTestnet', 'Matic', 'MaticTestnet'


3. Verify:
``` shell
$ truffle run verify Bridge@0xXXX.XXXXX --network XXXNet
```


