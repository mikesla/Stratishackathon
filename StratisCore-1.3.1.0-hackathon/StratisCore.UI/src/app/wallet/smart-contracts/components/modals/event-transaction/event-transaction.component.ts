import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '@shared/services/global.service';

import { SmartContractsServiceBase } from '../../../smart-contracts.service';

export enum Mode { Call, Create, IssueToken, IssueEvent }
export class Parameter {
    constructor(public type: number, public value: string) { }
}

@Component({
    selector: 'app-event-transaction',
    templateUrl: './event-transaction.component.html',
    styleUrls: ['./event-transaction.component.css']
})
export class EventTransactionComponent implements OnInit {
    @Input() mode: Mode;
    walletName: string;

    constructor(private globalService: GlobalService, private smartContractsService: SmartContractsServiceBase,
        private activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

    // tslint:disable-next-line: max-line-length
    newTokenByteCode = '4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000504500004C010200E1F046E10000000000000000E00022200B013000000E00000002000000000000522C0000002000000040000000000010002000000002000004000000000000000400000000000000006000000002000000000000030040850000100000100000000010000010000000000000100000000000000000000000002C00004F000000000000000000000000000000000000000000000000000000004000000C000000E42B00001C0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000080000000000000000000000082000004800000000000000000000002E74657874000000580C000000200000000E000000020000000000000000000000000000200000602E72656C6F6300000C000000004000000002000000100000000000000000000000000000400000420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000342C000000000000480000000200050050230000940800000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000C20203280500000A0204280700000602052805000006020E0428030000060202280600000A6F0700000A0428090000062A4602280800000A72010000706F0900000A2A4A02280800000A7201000070036F0A00000A2A4602280800000A720F0000706F0900000A2A4A02280800000A720F000070036F0A00000A2A4602280800000A72190000706F0B00000A2A4A02280800000A7219000070036F0C00000A2A7202280800000A7231000070038C08000001280D00000A6F0B00000A2A7602280800000A7231000070038C08000001280D00000A046F0C00000A2A0013300400A600000001000011042D34021201FE1503000002120102280600000A6F0700000A7D010000041201037D020000041201166A7D0300000407280100002B172A0202280600000A6F0700000A28080000060A06043402162A0202280600000A6F0700000A0604DB280900000602030203280800000604D72809000006021201FE1503000002120102280600000A6F0700000A7D010000041201037D020000041201047D0300000407280100002B172A000013300500AA00000002000011052D2A021202FE15030000021202037D010000041202047D020000041202166A7D0300000408280100002B172A020302280600000A6F0700000A280E0000060A020328080000060B0605370407053402162A020302280600000A6F0700000A0605DB280D00000602030705DB280900000602040204280800000605D72809000006021202FE15030000021202037D010000041202047D020000041202057D0300000408280100002B172A00001330040065000000030000110202280600000A6F0700000A03280E000006042E02162A0202280600000A6F0700000A0305280D000006021200FE1504000002120002280600000A6F0700000A7D040000041200037D050000041200057D070000041200047D0600000406280200002B172A8E02280800000A7249000070038C08000001048C08000001280F00000A056F0C00000A2A8A02280800000A7249000070038C08000001048C08000001280F00000A6F0B00000A2A42534A4201000100000000000C00000076342E302E33303331390000000005006C00000098030000237E0000040400000403000023537472696E67730000000008070000700000002355530078070000100000002347554944000000880700000C01000023426C6F6200000000000000020000015717A201090A000000FA013300160000010000000E00000004000000070000000E00000017000000010000000F00000007000000030000000100000003000000060000000100000003000000020000000200000000007E010100000000000600EB00440206001A0144020600D70010020F00640200000A00A10283020E00C60123020A008B0083020A007302830206008100AD010A000B0183020A00550083020A00B200830206005301AD010600AF02AD01000000001500000000000100010001001000C70100001500010001000A01100066010000250001000F000A0110005A010000250004000F000600BC0174000600DD0174000600C70278000600FE0174000600EE0174000600B60278000600C702780050200000000086180A027B000100812000000000860890018400050093200000000081089B0188000500A6200000000086086A0084000600B820000000008108730088000600CB2000000000E609D5028D000700DD20000000008108E50291000700F02000000000E6013500960008000D2100000000810040009C0009002C2100000000E601D501A3000B00E02100000000E601B401AA000D00982200000000E6013E01B300100009230000000081007201BB0013002D2300000000E6014B00C4001600000001009F0000000200F502000003007C0000000400A601000001003801000001003801000001003801000001007B02000001007B0200000200380100000100E00100000200CE0200000100C10100000200E00100000300CE0200000100F60100000200C00200000300CE0200000100040200000200F60100000300380100000100040200000200F6010200190009000A02010011000A02060019000A020A0051000A02060029000A02100029005E0016005900E3011B002900C3002000610046012500610050012A0061000100300061000B00350069009A023B0029006E01470069009A0264002100230005012E000B00D4002E001300DD002E001B00FC00410023000501810023000501A10023000501410053005A000200010000009F01CC0000007700CC000000E902D000020002000300010003000300020004000500010005000500020006000700010007000700048000000000000000000000000000000000A10200000400000000000000000000006B001E00000000000100020001000000000000000000830200000000010000000000000000000000000023020000000003000200040002001D004E001D005F00000000000047657455496E7436340053657455496E743634003C4D6F64756C653E0053797374656D2E507269766174652E436F72654C69620047657442616C616E63650053657442616C616E636500416C6C6F77616E636500494D657373616765006765745F4D657373616765006765745F4E616D65007365745F4E616D65006E616D650056616C7565547970650049536D617274436F6E7472616374537461746500736D617274436F6E74726163745374617465004950657273697374656E745374617465006765745F50657273697374656E7453746174650044656275676761626C6541747472696275746500436F6D70696C6174696F6E52656C61786174696F6E7341747472696275746500496E6465784174747269627574650052756E74696D65436F6D7061746962696C6974794174747269627574650076616C756500417070726F766500476574537472696E6700536574537472696E6700417070726F76616C4C6F67005472616E736665724C6F6700536574417070726F76616C00536D617274436F6E74726163742E646C6C006765745F53796D626F6C007365745F53796D626F6C0073796D626F6C0053797374656D005472616E7366657246726F6D0066726F6D00495374616E64617264546F6B656E005472616E73666572546F00746F006765745F53656E646572005370656E646572007370656E646572004F776E6572006F776E6572002E63746F720053797374656D2E446961676E6F737469637300537472617469732E536D617274436F6E7472616374732E5374616E64617264730053797374656D2E52756E74696D652E436F6D70696C6572536572766963657300446562756767696E674D6F6465730041646472657373006164647265737300537472617469732E536D617274436F6E74726163747300466F726D617400536D617274436F6E7472616374004F626A656374004F6C64416D6F756E740063757272656E74416D6F756E7400616D6F756E74006765745F546F74616C537570706C79007365745F546F74616C537570706C7900746F74616C537570706C7900000000000D530079006D0062006F006C0000094E0061006D006500001754006F00740061006C0053007500700070006C0079000017420061006C0061006E00630065003A007B0030007D00002341006C006C006F00770061006E00630065003A007B0030007D003A007B0031007D0000000000F5148117F9C6F840A461EEE65ADF72F40004200101080320000105200101111105200101121D042000122D042000112104200012310420010E0E052002010E0E0420010B0E052002010E0B0500020E0E1C0507020B110C06300101011E00040A01110C0607030B0B110C0407011110040A0111100600030E0E1C1C087CEC85D7BEA7798E0306112102060B08200401121D0B0E0E0320000E042001010E0320000B042001010B0520010B11210620020111210B0620020211210B08200302112111210B0720030211210B0B08200301112111210B0720020B112111210328000E0328000B0801000800000000001E01000100540216577261704E6F6E457863657074696F6E5468726F7773010801000200000000000401000000000000000000000000000000000010000000000000000000000000000000282C00000000000000000000422C0000002000000000000000000000000000000000000000000000342C0000000000000000000000005F436F72446C6C4D61696E006D73636F7265652E646C6C0000000000FF250020001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000C000000543C00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    newEventByteCode = '4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000504500004C01020005205DAF0000000000000000E00022200B013000001E00000002000000000000023D0000002000000040000000000010002000000002000004000000000000000400000000000000006000000002000000000000030040850000100000100000000010000010000000000000100000000000000000000000B03C00004F000000000000000000000000000000000000000000000000000000004000000C000000943C00001C0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000080000000000000000000000082000004800000000000000000000002E74657874000000081D000000200000001E000000020000000000000000000000000000200000602E72656C6F6300000C000000004000000002000000200000000000000000000000000000400000420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000E43C0000000000004800000002000500742900002013000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001330030078000000000000000203280500000A02166A28070000060202280600000A6F0700000A2819000006020E07280D000006020E06280F000006020E0528110000060202280800000A6F0900000A28130000060202280800000A6F0900000A022810000006D728150000060204280B00000602052805000006020E0428030000062A4602280A00000A72010000706F0B00000A2A4A02280A00000A7201000070036F0C00000A2A4602280A00000A720F0000706F0B00000A2A4A02280A00000A720F000070036F0C00000A2A4602280A00000A72190000706F0D00000A2A4A02280A00000A7219000070036F0E00000A2A7202280A00000A7231000070038C07000001280F00000A6F0D00000A2A1E02281000000A2A4602280A00000A72450000706F0D00000A2A4A02280A00000A7245000070036F0E00000A2A4602280A00000A72610000706F0D00000A2A4A02280A00000A7261000070036F0E00000A2A4602280A00000A72730000706F0D00000A2A4A02280A00000A7273000070036F0E00000A2A4602280A00000A72850000706F0D00000A2A4A02280A00000A7285000070036F0E00000A2A4602280A00000A72B10000706F0D00000A2A4A02280A00000A72B1000070036F0E00000A2A4602280A00000A72D50000706F0D00000A2A4A02280A00000A72D5000070036F0E00000A2A4602280A00000A72F50000706F0D00000A2A4A02280A00000A72F5000070036F0E00000A2A4602280A00000A721F0100706F1100000A2A4A02280A00000A721F010070036F1200000A2A7202280A00000A723B010070038C07000001280F00000A6F0D00000A2A9A02280A00000A723B01007002280600000A6F0700000A8C07000001280F00000A6F0D00000A2A9E02280A00000A723B01007002280600000A6F0700000A8C07000001280F00000A036F0E00000A2A9E02280A00000A723B01007002280600000A6F0700000A8C07000001280F00000A046F0E00000A2A9A02280A00000A725901007002280600000A6F0700000A8C07000001280F00000A6F1300000A2A9E02280A00000A725901007002280600000A6F0700000A8C07000001280F00000A036F1400000A2A7602280A00000A727F010070038C07000001280F00000A046F0E00000A2A7202280A00000A7297010070038C0F000001280F00000A6F1100000A2A5202280800000A6F0900000A022814000006FE032A00133003008B000000010000111200FE1505000002120002280600000A6F1500000A7D070000041200167D090000041200167D0A0000041200047D0800000402280A00000A7297010070038C0F000001280F00000A066F0100002B0228060000060B0207176AD72807000006021202FE15040000021202037D040000041202047D05000004120272A90100707D0600000408280200002B2A9A02280A00000A729701007002281B0000068C0F000001280F00000A6F0300002B7B090000042A9A02280A00000A729701007002281B0000068C0F000001280F00000A6F0300002B7B070000042A9A02280A00000A729701007002281B0000068C0F000001280F00000A6F0300002B7B0A0000042A8602280A00000A729701007002281B0000068C0F000001280F00000A6F0300002B2A0000133003004A0000000200001102280A00000A723B010070038C07000001280F00000A6F0D00000A0A02280A00000A7297010070068C0F000001280F00000A6F0300002B7B0800000403281900000A2C03176A2A166A2A7202280A00000A7297010070038C0F000001280F00000A6F0300002B2A00133003002D00000003000011020328290000060A1200177D0A00000402280A00000A7297010070038C0F000001280F00000A066F0100002B2A00000013300400380000000200001102280800000A6F0900000A022812000006DB0A02280E0000060602280E00000602280C000006DBD9022814000006022812000006DB5CDB2A133003003800000002000011020304FE0316FE0172D7010070281A00000A0228060000060435080228060000061002030A2B0C0206282D00000606176AD70A060436F02A133003008C00000004000011020328290000060A02067B0A00000416FE017213020070281A00000A1200177D0A000004067B0700000402280C000006DB0B0203282A00000602067B0800000407281B00000A260202281800000602280C000006281B00000A26021202FE1503000002120202281C00000A7D0200000412020228180000067D030000041202037D0100000408280400002B2A133003009A000000050000110202281E00000616FE017217020070281A00000A0202280600000A6F1500000A02282B000006FE0516FE017263020070281A00000A0202280A000006166AFE03729B020070281A00000A022806000006176AD70A020602280600000A6F0700000A282F0000060206281C0000060217281F00000602280A0000060B0207176ADB280B00000602280A0000062D0C0202282B000006280D0000062A2602030428230000062A1330030017010000060000110202280600000A6F1500000A166AFE0172AD020070281A00000A0202280600000A6F0700000A03281D00000A72AD020070281A00000A02281B0000060A02280A00000A7297010070068C0F000001280F00000A6F0300002B0B02077B0A00000472CB020070281A00000A02077B0900000416FE017250030070281A00000A04176A2E02162A1201037D0800000402280A00000A723B01007002280600000A6F0700000A8C07000001280F00000A166A6F0E00000A02280A00000A723B010070038C07000001280F00000A066F0E00000A021202FE1503000002120202280600000A6F0700000A7D020000041202037D0300000408280400002B02280A00000A7297010070068C0F000001280F00000A076F0100002B172A0013300300A1000000070000110202280600000A6F1500000A166AFE0172AD020070281A00000A020302280600000A6F0700000A281900000A72AD020070281A00000A020205282100000602280600000A6F0700000A281900000A72AD020070281A00000A020304281D00000A72AD020070281A00000A020405283200000602032833000006021200FE15030000021200037D020000041200047D030000041200057D0100000406280400002B2A6A020302032808000006176AD7282000000602040328230000062A4A020302032808000006176ADB28200000062A0042534A4201000100000000000C00000076342E302E33303331390000000005006C00000064070000237E0000D00700003C06000023537472696E6773000000000C0E0000780300002355530084110000100000002347554944000000941100008C01000023426C6F6200000000000000020000015715A201090A000000FA0133001600000100000010000000050000000A000000330000002D0000001D0000000900000007000000010000000E0000001B000000010000000200000003000000040000000000300301000000000006001202A60406004102A6040600FE0180040F00C60400000A006C054E050A00BF014E050A003E054E050600B5016F030A0032024E050A0089014E050A0099024E050A00D3014E0506008E026F0306007A056F0306000E006F030A00A9054E05000000001500000000000100010001001000FD0300001500010001000A0110003E0400002100010034000A011000380600002100040034000A011000A205000021000700340006004500D10006008E03D40006002204D40006004500D10006002204D40006001E00D80006006902D1000600E104D40006009803DB000600BC00DB0050200000000086187A04DE000100D4200000000086084203EA000800E6200000000086084D03EE000800F9200000000086089E01EA0009000B21000000008108A701EE0009001E21000000008608FE0525000A0030210000000081080E06F3000A0043210000000086006F02F8000B006021000000008608540125000C006821000000008608BE0525000C007A21000000008108D005F3000C008D21000000008608F20025000D009F21000000008108FF00F3000D00B221000000008608250125000E00C4210000000081083201F3000E00D721000000008608B30325000F00E921000000008108CD03F3000F00FC210000000086080403250010000E220000000081081A03F30010002122000000008608AA02250011003322000000008108BE02F30011004622000000008608D202250012005822000000008108EB02F30012006B2200000000860847041B0013007D220000000081085904FE00130090220000000086003105F8001400AD22000000008608050525001500D4220000000081081B05F3001500FC220000000081003A000401160024230000000086085E000B0118004B2300000000810870000F01180073230000000081007601040119009123000000008600790214011B00AE2300000000860082000B011C00C4230000000081006B041A011C005B24000000008600A2030B011E008224000000008600DA0025001E00A9240000000086008A000B011E00D024000000008100950521011E00F4240000000086006B01F8001E004A25000000008100950526011F006825000000008100A300F3002000A425000000008600150125002100E82500000000860093042C0121002C26000000008600E700F3002300C4260000000086009F05060024006A27000000008100B9051A01240074270000000086001A0432012600982800000000860086033901280045290000000081000F0404012B0060290000000081007603FE002D0000000100F80100000200E20500000300B00100000400580300000500E703000006003F01000007000C01000001006902000001006902000001006902000001007404000001006902000001006902000001006902000001006902000001006902000001006902000001006902000001006902000001004605000001006902000001004605000002006902000001006902000001004605000002008101000001004D00000001004D00000002004605000001004605000001004D00000001004D0000000100CC0000000200D400000001005500000001004D0000000200460500000100250400000200F005000001009303000002002504000003004D00000001002504000002004D0000000100930309007A04010011007A04060019007A040A0049007A04060029007A041000290092011600510033041B002900A00220005900280425002900E4012900610081022E0061008B02330061000100390061000B003E006900650544002900480125006100EF044A006100FA04500061005F035700610067035C0051005F02250061008B056A0029009502770061008105830039001E068E002900F7059B0029003E04A9002900D5041B0039002A068E002100230084012E000B0053012E0013005C012E001B007B01410023008401610023008401810023008401A10023008401C1002300840162008A009600A100B600BB00C300020001000000510342010000AB0142010000120646010000580146010000D40546010000030146010000360146010000D103460100001E0346010000C20246010000EF02460100005D044A01000034054601000074004F0102000200030001000300030002000400050001000500050002000600070001000700070002000900090002000A000B0001000B000B0002000C000D0001000D000D0002000E000F0001000F000F0002001000110001001100110002001200130001001300130002001400150001001500150002001600170001001700170002001800190001001900190002001B001B0001001C001B0002001E001D0001001F001D000480000000000000000000000000000000006C050000040000000000000000000000C80023000000000001000200010000000000000000004E05000000000300020004000200050002002D0072002F007E00310072002F00B10000000047657455496E7436340053657455496E743634003C4D6F64756C653E00646174610053797374656D2E507269766174652E436F72654C6962005365745469636B65496400546F6B656E496400746F6B656E4964007469636B65744964006765745F41646472657373426964646564007365745F41646472657373426964646564004973456E646564004765745469636B65744F76657262696452657475726E6564005365745469636B65744F76657262696452657475726E6564006F76657262696452657475726E65640066726F6D42696400746F426964004765745469636B6574426964004765744F766572626964006765745F456E645072696365007365745F456E645072696365006D696E50726963650047657443757272656E745072696365006765745F4D61785072696365007365745F4D61785072696365006D61785072696365006765745F42616C616E6365006765745F476574436F6E747261637442616C616E63650047657442616C616E63650053657442616C616E63650062616C616E636500494D657373616765006765745F4D657373616765006765745F4E616D65007365745F4E616D65006E616D650056616C7565547970650049536D617274436F6E74726163745374617465004950657273697374656E745374617465006765745F50657273697374656E7453746174650073746174650044656275676761626C6541747472696275746500436F6D70696C6174696F6E52656C61786174696F6E7341747472696275746500496E6465784174747269627574650052756E74696D65436F6D7061746962696C697479417474726962757465006765745F56616C75650076616C75650042616C616E63654F66004F776E65724F6600476574537472696E6700536574537472696E67004C6F670049426C6F636B006765745F426C6F636B006765745F41756374696F6E456E64426C6F636B007365745F41756374696F6E456E64426C6F636B006765745F41756374696F6E4D696E5072696365426C6F636B007365745F41756374696F6E4D696E5072696365426C6F636B006765745F41756374696F6E5374617274426C6F636B007365745F41756374696F6E5374617274426C6F636B00536D617274436F6E74726163742E646C6C006765745F53796D626F6C007365745F53796D626F6C0073796D626F6C00476574426F6F6C00536574426F6F6C0053797374656D0052656D6F7665546F6B656E46726F6D005472616E7366657246726F6D0066726F6D00636865636B6564496E004765745469636B6574436865636B496E006765745F41756374696F6E74426C6F636B4475726174696F6E007365745F41756374696F6E74426C6F636B4475726174696F6E0061756374696F6E74426C6F636B4475726174696F6E004576656E74447574636841756374696F6E00416464546F6B656E546F005472616E73666572546F00746F006765745F4E756D626572006765745F53656E646572005472616E73666572006765745F436F6E74726163744F776E6572007365745F436F6E74726163744F776E6572005365744F776E6572006F776E6572002E63746F720053797374656D2E446961676E6F737469637300446973747269627574654F766572626964730053797374656D2E52756E74696D652E436F6D70696C6572536572766963657300446562756767696E674D6F646573006765745F41646472657373006269646465724164647265737300476574416464726573730053657441646472657373006765745F5469636B65744964427941646472657373007365745F5469636B65744964427941646472657373004765745469636B65744964427941646472657373006164647265737300537472617469732E536D617274436F6E74726163747300466F726D617400536D617274436F6E7472616374004F626A6563740047657453747275637400536574537472756374004765745469636B6574004275795469636B657400495472616E73666572526573756C74004D696E74006765745F5469636B657473416D6F756E74007365745F5469636B657473416D6F756E74007469636B657473416D6F756E7400616D6F756E7400417373657274006765745F546F74616C537570706C79007365745F546F74616C537570706C79006F705F457175616C697479006F705F496E657175616C6974790042757900000D530079006D0062006F006C0000094E0061006D006500001754006F00740061006C0053007500700070006C007900001354006F00740061006C003A007B0030007D00001B5400690063006B0065007400730041006D006F0075006E007400001145006E0064005000720069006300650000114D006100780050007200690063006500002B410075006300740069006F006E00740042006C006F0063006B004400750072006100740069006F006E000023410075006300740069006F006E005300740061007200740042006C006F0063006B00001F410075006300740069006F006E0045006E00640042006C006F0063006B000029410075006300740069006F006E004D0069006E005000720069006300650042006C006F0063006B00001B43006F006E00740072006100630074004F0077006E0065007200001D5400690063006B00650074004900640073005B007B0030007D005D00002541006400640072006500730073004200690064006400650064005B007B0030007D005D000017420061006C0061006E00630065003A007B0030007D00001154006F006B0065006E007B0030007D00002D6F006E00650020006D006F007200650020007400690063006B0065007400280074006F006B0065006E002900003B62006900640073002000770069006E0064006F0077002000730068006F0075006C006400200062006500200063006F007200720065006300740000037400004B4F006E006C00790020006F006E00650020007400690063006B006500740020006200790020006100640064007200650073007300200069007300200061006C006C006F00770065006400003762006900640020006C0065007300730020007400680061006E002000630075007200720065006E007400200070007200690063006500001173006F006C00640020006F0075007400001D41007300730065007200740020006600610069006C00650064002E000080836E006F00200070006F00730073006900620069006C00740079002000730065006E00640020007400690063006B006500740020006200650066006F00720065002000730061006C006500200069007300200065006E00640065006400200061006E0064002000660075006E00640073002000720065007400750072006E006500640000277400690063006B0065007400200061006C007200650061006400790020007500730065006400001C2DBD589D70A046A504FDD936413ADD000420010108032000010520010111110520010112190420001229042000111D042000122D0320000B04200012310420010E0E052002010E0E0420010B0E052002010E0B0500020E0E1C052001111D0E062002010E111D042001020E052002010E0207070311140B111007300102010E1E00040A01111406300101011E00040A011110063001011E000E0307010B07000202111D111D040701111405200201020E07070311140B110C0720021241111D0B040A01110C0407020B0B0707030B1114110C040701110C087CEC85D7BEA7798E02060B0306111D02060E0206020B20070112190B0E0E0B0B0B0320000E042001010E042001010B0520010B111D05200101111D06200201111D0B032000020420010102052001111D0B062002010B111D042000111405200111140B052002010B0B06200202111D0B08200301111D111D0B0328000E0328000B042800111D032800020801000800000000001E01000100540216577261704E6F6E457863657074696F6E5468726F777301080100020000000000040100000000000000000000000000000000000010000000000000000000000000000000D83C00000000000000000000F23C0000002000000000000000000000000000000000000000000000E43C0000000000000000000000005F436F72446C6C4D61696E006D73636F7265652E646C6C0000000000FF25002000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000C000000043D00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    modeEnum = Mode;
    transactionForm: FormGroup;
    parameterTypes: Parameter[] = [
        new Parameter(1, 'Bool'),
        new Parameter(2, 'Byte'),
        new Parameter(3, 'Char'),
        new Parameter(4, 'String'),
        new Parameter(5, 'UInt'),
        new Parameter(6, 'Int'),
        new Parameter(7, 'ULong'),
        new Parameter(8, 'Long'),
        new Parameter(9, 'Address'),
        new Parameter(10, 'Byte Array')
    ];
    parameters: FormArray;
    selectedSenderAddress = '';
    balance = 0;
    amount: FormControl;
    feeAmount: FormControl;
    gasPrice: FormControl;
    gasLimit: FormControl;
    methodName: FormControl;
    contractAddress: FormControl;
    contractCode: FormControl;
    password: FormControl;
    totalSupply: FormControl;
    tokenName: FormControl;
    tokenSymbol: FormControl;
    ticketsAmount: FormControl;
    auctionDuration: FormControl;
    maxPrice: FormControl;
    minPrice: FormControl;

    coinUnit: string;
    loading: boolean;
    apiError: string;

    gasCallLimitMinimum = 10000;
    gasCreateLimitMinimum = 12000;
    gasCreateTokenLimitMinimum = 15000;
    gasLimitMaximum = 100000;
    gasPriceMinimum = 1;
    gasPriceMaximum = 10000;

    get title(): string { return `${this.modeText}`; }
    get buttonText(): string { return `${this.modeText}`; }

    private get modeText(): string {
        switch (this.mode) {
            case Mode.Call:
                return this.loading ? 'Calling Contract' : 'Call Contract';
            case Mode.Create:
                return this.loading ? 'Creating Contract' : 'Create Contract';
            case Mode.IssueToken:
                return this.loading ? 'Issuing Token' : 'Issue Token';
            case Mode.IssueEvent:
                return this.loading ? 'Issuing Event' : 'Issue Event';
            default:
                return 'Unknown';
        }
    }

    ngOnInit() {
        this.registerControls();
        this.walletName = this.globalService.getWalletName();
    }

    closeClicked() {
        this.activeModal.close();
    }

    addParameterClicked() {
        this.parameters.push(this.createParameter());
    }

    createParameter(): FormGroup {
        const defaultType = this.parameterTypes.length ? this.parameterTypes[0].type : 1;

        return this.formBuilder.group({
            type: defaultType,
            value: ''
        });
    }

    removeParameterClicked(index: number) {
        this.parameters.removeAt(index);
    }

    onSubmit() {
        // Hack the parameters into a format the API expects
        const result = this.createModel();

        this.loading = true;

        // We don't need an observable here so let's treat it as a promise.
        (this.mode === Mode.Create || this.mode === Mode.IssueToken || this.mode === Mode.IssueEvent
            ? this.smartContractsService.PostCreate(result)
            : this.smartContractsService.PostCall(result))
            .toPromise()
            .then(transactionHash => {
                this.loading = false;
                this.activeModal.close({ symbol: this.tokenSymbol.value.toUpperCase(), name: this.tokenName.value, transactionHash });
            },
                error => {
                    this.loading = false;
                    if (!error.error.errors) {
                        if (error.error.value.message) {
                            this.apiError = error.error.value.message;
                        } else {
                            console.log(error);
                        }
                    } else {
                        this.apiError = error.error.errors[0].message;
                    }
                });
    }

    private createModel() {

        if (this.mode === Mode.IssueToken) {
            return {
                amount: this.amount.value,
                feeAmount: this.feeAmount.value,
                gasPrice: this.gasPrice.value,
                gasLimit: this.gasLimit.value,
                //ulong ticketsAmount, string name, string symbol, ulong auctiontBlockDuration, ulong maxPrice, ulong minPrice

                parameters: [
                    `7#${this.ticketsAmount.value}`,
                    `4#${this.tokenName.value}`,
                    `4#${this.tokenSymbol.value.toUpperCase()}`,
                    `7#${this.auctionDuration.value}`,
                    `7#${this.maxPrice.value}`,
                    `7#${this.minPrice.value}`,
                ],
                contractCode: this.newTokenByteCode,
                password: this.password.value,
                walletName: this.walletName,
                sender: this.selectedSenderAddress
            };
        }

        if (this.mode === Mode.IssueEvent) {
            return {
                amount: this.amount.value,
                feeAmount: this.feeAmount.value,
                gasPrice: this.gasPrice.value,
                gasLimit: this.gasLimit.value,
                parameters: [
                    `7#${this.ticketsAmount.value}`,
                    `4#${this.tokenName.value}`,
                    `4#${this.tokenSymbol.value.toUpperCase()}`,
                    `7#${this.auctionDuration.value}`,
                    `7#${this.maxPrice.value}`,
                    `7#${this.minPrice.value}`,
                ],
                contractCode: this.newEventByteCode,
                password: this.password.value,
                walletName: this.walletName,
                sender: this.selectedSenderAddress
            };
        }

        return {
            ...this.transactionForm.value,
            parameters: this.transactionForm.value.parameters.map(p => `${p.type}#${p.value}`),
            walletName: this.walletName,
            sender: this.selectedSenderAddress
        };
    }

    private registerControls() {
        const amountValidator = control => Number(control.value) > this.balance ? { amountError: true } : null;
        const gasPriceTooLowValidator = control => Number(control.value) < this.gasPriceMinimum ? { gasPriceTooLowError: true } : null;
        const gasPriceTooHighValidator = control => Number(control.value) > this.gasPriceMaximum ? { gasPriceTooHighError: true } : null;
        const gasLimitMaximumValidator = control => Number(control.value) > this.gasLimitMaximum ? { gasLimitTooHighError: true } : null;
        // tslint:disable-next-line:max-line-length
        const gasCallLimitMinimumValidator = control => Number(control.value) < this.gasCallLimitMinimum ? { gasCallLimitTooLowError: true } : null;
        // tslint:disable-next-line:max-line-length
        const gasCreateLimitMinimumValidator = control => Number(control.value) < this.gasCreateLimitMinimum ? { gasCreateLimitTooLowError: true } : null;
        const oddValidator = control => String(control.value).length % 2 !== 0 ? { hasOddNumberOfCharacters: true } : null;

        const integerValidator = Validators.pattern('^[0-9][0-9]*$');

        const gasLimitValidator = (this.mode === Mode.Call ? gasCallLimitMinimumValidator : gasCreateLimitMinimumValidator);

        this.amount = new FormControl(0, [amountValidator, Validators.min(0)]);
        this.feeAmount = new FormControl(0.001, [Validators.required, amountValidator, Validators.min(0)]);
        // tslint:disable-next-line:max-line-length
        this.gasPrice = new FormControl(100, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasPriceTooLowValidator, gasPriceTooHighValidator, Validators.min(0)]);

        if (this.mode === Mode.Call) {
            // tslint:disable-next-line:max-line-length
            this.gasLimit = new FormControl(this.gasLimitMaximum, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasLimitValidator, gasLimitMaximumValidator, Validators.min(0)]);
        }

        if (this.mode === Mode.Create) {
            // tslint:disable-next-line:max-line-length
            this.gasLimit = new FormControl(this.gasLimitMaximum, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasLimitValidator, gasLimitMaximumValidator, Validators.min(0)]);
        }

        if (this.mode === Mode.IssueToken || this.mode === Mode.IssueEvent) {
            // tslint:disable-next-line:max-line-length
            this.gasLimit = new FormControl(this.gasLimitMaximum, [Validators.required, integerValidator, Validators.pattern('^[+]?([0-9]{0,})*[.]?([0-9]{0,2})?$'), gasLimitValidator, gasLimitMaximumValidator, Validators.min(0)]);
        }

        this.methodName = new FormControl('', [Validators.required, Validators.nullValidator]);
        var contractCode = this.mode === Mode.IssueToken ? this.newTokenByteCode : '';
        contractCode = this.mode === Mode.IssueEvent ? this.newEventByteCode : '';
        // tslint:disable-next-line:max-line-length
        this.contractCode = new FormControl(contractCode, [Validators.required, Validators.nullValidator, Validators.pattern('[0-9a-fA-F]*'), oddValidator]);
        this.parameters = new FormArray([]);
        this.password = new FormControl('', [Validators.required, Validators.nullValidator]);
        this.totalSupply = new FormControl(21 * 1000 * 1000, [Validators.min(1), Validators.required]);

        this.tokenName = new FormControl('New Event', [Validators.required]);
        this.tokenSymbol = new FormControl('ENT', [Validators.required]);

        this.ticketsAmount= new FormControl(3, [Validators.min(1), Validators.required]);;
        this.auctionDuration = new FormControl(5000, [Validators.min(1), Validators.required]);;
        this.maxPrice = new FormControl(20, [Validators.min(1), Validators.required]);;
        this.minPrice = new FormControl(10, [Validators.min(1), Validators.required]);;


        if (this.mode === Mode.Call) {
            this.contractAddress = new FormControl('', [Validators.required, Validators.nullValidator]);

            this.transactionForm = new FormGroup({
                amount: this.amount,
                feeAmount: this.feeAmount,
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit,
                parameters: this.parameters,
                methodName: this.methodName,
                contractAddress: this.contractAddress,
                password: this.password
            });
        } else if (this.mode === Mode.Create) {
            this.transactionForm = new FormGroup({
                amount: this.amount,
                feeAmount: this.feeAmount,
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit,
                parameters: this.parameters,
                contractCode: this.contractCode,
                password: this.password
            });
        } else if (this.mode === Mode.IssueToken || this.mode === Mode.IssueEvent) {
            this.transactionForm = new FormGroup({
                feeAmount: this.feeAmount,
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit,
                contractCode: this.contractCode,
                password: this.password,
                totalSupply: this.totalSupply,
                tokenName: this.tokenName,
                tokenSymbol: this.tokenSymbol,
                ticketsAmount: this.ticketsAmount,
                auctionDuration: this.auctionDuration,
                maxPrice: this.maxPrice,
                minPrice: this.minPrice
            });
        }
    }
}
