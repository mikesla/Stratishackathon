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
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() mode: Mode;
  walletName: string;

  constructor(private globalService: GlobalService, private smartContractsService: SmartContractsServiceBase,
    private activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  // tslint:disable-next-line: max-line-length
  newTokenByteCode = '4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000504500004C010200E1F046E10000000000000000E00022200B013000000E00000002000000000000522C0000002000000040000000000010002000000002000004000000000000000400000000000000006000000002000000000000030040850000100000100000000010000010000000000000100000000000000000000000002C00004F000000000000000000000000000000000000000000000000000000004000000C000000E42B00001C0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000080000000000000000000000082000004800000000000000000000002E74657874000000580C000000200000000E000000020000000000000000000000000000200000602E72656C6F6300000C000000004000000002000000100000000000000000000000000000400000420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000342C000000000000480000000200050050230000940800000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000C20203280500000A0204280700000602052805000006020E0428030000060202280600000A6F0700000A0428090000062A4602280800000A72010000706F0900000A2A4A02280800000A7201000070036F0A00000A2A4602280800000A720F0000706F0900000A2A4A02280800000A720F000070036F0A00000A2A4602280800000A72190000706F0B00000A2A4A02280800000A7219000070036F0C00000A2A7202280800000A7231000070038C08000001280D00000A6F0B00000A2A7602280800000A7231000070038C08000001280D00000A046F0C00000A2A0013300400A600000001000011042D34021201FE1503000002120102280600000A6F0700000A7D010000041201037D020000041201166A7D0300000407280100002B172A0202280600000A6F0700000A28080000060A06043402162A0202280600000A6F0700000A0604DB280900000602030203280800000604D72809000006021201FE1503000002120102280600000A6F0700000A7D010000041201037D020000041201047D0300000407280100002B172A000013300500AA00000002000011052D2A021202FE15030000021202037D010000041202047D020000041202166A7D0300000408280100002B172A020302280600000A6F0700000A280E0000060A020328080000060B0605370407053402162A020302280600000A6F0700000A0605DB280D00000602030705DB280900000602040204280800000605D72809000006021202FE15030000021202037D010000041202047D020000041202057D0300000408280100002B172A00001330040065000000030000110202280600000A6F0700000A03280E000006042E02162A0202280600000A6F0700000A0305280D000006021200FE1504000002120002280600000A6F0700000A7D040000041200037D050000041200057D070000041200047D0600000406280200002B172A8E02280800000A7249000070038C08000001048C08000001280F00000A056F0C00000A2A8A02280800000A7249000070038C08000001048C08000001280F00000A6F0B00000A2A42534A4201000100000000000C00000076342E302E33303331390000000005006C00000098030000237E0000040400000403000023537472696E67730000000008070000700000002355530078070000100000002347554944000000880700000C01000023426C6F6200000000000000020000015717A201090A000000FA013300160000010000000E00000004000000070000000E00000017000000010000000F00000007000000030000000100000003000000060000000100000003000000020000000200000000007E010100000000000600EB00440206001A0144020600D70010020F00640200000A00A10283020E00C60123020A008B0083020A007302830206008100AD010A000B0183020A00550083020A00B200830206005301AD010600AF02AD01000000001500000000000100010001001000C70100001500010001000A01100066010000250001000F000A0110005A010000250004000F000600BC0174000600DD0174000600C70278000600FE0174000600EE0174000600B60278000600C702780050200000000086180A027B000100812000000000860890018400050093200000000081089B0188000500A6200000000086086A0084000600B820000000008108730088000600CB2000000000E609D5028D000700DD20000000008108E50291000700F02000000000E6013500960008000D2100000000810040009C0009002C2100000000E601D501A3000B00E02100000000E601B401AA000D00982200000000E6013E01B300100009230000000081007201BB0013002D2300000000E6014B00C4001600000001009F0000000200F502000003007C0000000400A601000001003801000001003801000001003801000001007B02000001007B0200000200380100000100E00100000200CE0200000100C10100000200E00100000300CE0200000100F60100000200C00200000300CE0200000100040200000200F60100000300380100000100040200000200F6010200190009000A02010011000A02060019000A020A0051000A02060029000A02100029005E0016005900E3011B002900C3002000610046012500610050012A0061000100300061000B00350069009A023B0029006E01470069009A0264002100230005012E000B00D4002E001300DD002E001B00FC00410023000501810023000501A10023000501410053005A000200010000009F01CC0000007700CC000000E902D000020002000300010003000300020004000500010005000500020006000700010007000700048000000000000000000000000000000000A10200000400000000000000000000006B001E00000000000100020001000000000000000000830200000000010000000000000000000000000023020000000003000200040002001D004E001D005F00000000000047657455496E7436340053657455496E743634003C4D6F64756C653E0053797374656D2E507269766174652E436F72654C69620047657442616C616E63650053657442616C616E636500416C6C6F77616E636500494D657373616765006765745F4D657373616765006765745F4E616D65007365745F4E616D65006E616D650056616C7565547970650049536D617274436F6E7472616374537461746500736D617274436F6E74726163745374617465004950657273697374656E745374617465006765745F50657273697374656E7453746174650044656275676761626C6541747472696275746500436F6D70696C6174696F6E52656C61786174696F6E7341747472696275746500496E6465784174747269627574650052756E74696D65436F6D7061746962696C6974794174747269627574650076616C756500417070726F766500476574537472696E6700536574537472696E6700417070726F76616C4C6F67005472616E736665724C6F6700536574417070726F76616C00536D617274436F6E74726163742E646C6C006765745F53796D626F6C007365745F53796D626F6C0073796D626F6C0053797374656D005472616E7366657246726F6D0066726F6D00495374616E64617264546F6B656E005472616E73666572546F00746F006765745F53656E646572005370656E646572007370656E646572004F776E6572006F776E6572002E63746F720053797374656D2E446961676E6F737469637300537472617469732E536D617274436F6E7472616374732E5374616E64617264730053797374656D2E52756E74696D652E436F6D70696C6572536572766963657300446562756767696E674D6F6465730041646472657373006164647265737300537472617469732E536D617274436F6E74726163747300466F726D617400536D617274436F6E7472616374004F626A656374004F6C64416D6F756E740063757272656E74416D6F756E7400616D6F756E74006765745F546F74616C537570706C79007365745F546F74616C537570706C7900746F74616C537570706C7900000000000D530079006D0062006F006C0000094E0061006D006500001754006F00740061006C0053007500700070006C0079000017420061006C0061006E00630065003A007B0030007D00002341006C006C006F00770061006E00630065003A007B0030007D003A007B0031007D0000000000F5148117F9C6F840A461EEE65ADF72F40004200101080320000105200101111105200101121D042000122D042000112104200012310420010E0E052002010E0E0420010B0E052002010E0B0500020E0E1C0507020B110C06300101011E00040A01110C0607030B0B110C0407011110040A0111100600030E0E1C1C087CEC85D7BEA7798E0306112102060B08200401121D0B0E0E0320000E042001010E0320000B042001010B0520010B11210620020111210B0620020211210B08200302112111210B0720030211210B0B08200301112111210B0720020B112111210328000E0328000B0801000800000000001E01000100540216577261704E6F6E457863657074696F6E5468726F7773010801000200000000000401000000000000000000000000000000000010000000000000000000000000000000282C00000000000000000000422C0000002000000000000000000000000000000000000000000000342C0000000000000000000000005F436F72446C6C4D61696E006D73636F7265652E646C6C0000000000FF250020001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000C000000543C00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  newEventByteCode = '4D5A90000300000004000000FFFF0000B800000000000000400000000000000000000000000000000000000000000000000000000000000000000000800000000E1FBA0E00B409CD21B8014CCD21546869732070726F6772616D2063616E6E6F742062652072756E20696E20444F53206D6F64652E0D0D0A2400000000000000504500004C0102009C12EAD10000000000000000E00022200B013000001A00000002000000000000A6380000002000000040000000000010002000000002000004000000000000000400000000000000006000000002000000000000030040850000100000100000000010000010000000000000100000000000000000000000543800004F000000000000000000000000000000000000000000000000000000004000000C000000383800001C0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000080000000000000000000000082000004800000000000000000000002E74657874000000AC18000000200000001A000000020000000000000000000000000000200000602E72656C6F6300000C0000000040000000020000001C0000000000000000000000000000400000420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000883800000000000048000000020005008C270000AC10000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001330030076000000000000000203280500000A02166A28050000060202280600000A6F0700000A28150000060220881300006A280D0000060202280800000A6F0900000A280F0000060202280800000A6F0900000A02280C000006D72811000006022000CA9A3B6A28090000060220009435776A280B00000602196A28070000062A7202280A00000A7201000070038C07000001280B00000A6F0C00000A2A1E02280D00000A2A4602280A00000A72150000706F0C00000A2A4A02280A00000A7215000070036F0E00000A2A4602280A00000A722D0000706F0C00000A2A4A02280A00000A722D000070036F0E00000A2A4602280A00000A72490000706F0C00000A2A4A02280A00000A7249000070036F0E00000A2A4602280A00000A725B0000706F0C00000A2A4A02280A00000A725B000070036F0E00000A2A4602280A00000A726D0000706F0C00000A2A4A02280A00000A726D000070036F0E00000A2A4602280A00000A72990000706F0C00000A2A4A02280A00000A7299000070036F0E00000A2A4602280A00000A72BD0000706F0C00000A2A4A02280A00000A72BD000070036F0E00000A2A4602280A00000A72DD0000706F0C00000A2A4A02280A00000A72DD000070036F0E00000A2A4602280A00000A72070100706F0F00000A2A4A02280A00000A7207010070036F1000000A2A9A02280A00000A722301007002280600000A6F0700000A8C07000001280B00000A6F0C00000A2A9E02280A00000A722301007002280600000A6F0700000A8C07000001280B00000A036F0E00000A2A9A02280A00000A724101007002280600000A6F0700000A8C07000001280B00000A6F1100000A2A9E02280A00000A724101007002280600000A6F0700000A8C07000001280B00000A036F1200000A2A7602280A00000A7267010070038C07000001280B00000A046F0E00000A2A7202280A00000A727F010070038C0F000001280B00000A6F0F00000A2A5202280800000A6F0900000A022810000006FE032A0000133003008B000000010000111200FE1505000002120002280600000A6F1300000A7D070000041200167D090000041200167D0A0000041200047D0800000402280A00000A727F010070038C0F000001280B00000A066F0100002B0228040000060B0207176AD72805000006021202FE15040000021202037D040000041202047D05000004120272910100707D0600000408280200002B2A9A02280A00000A727F0100700228160000068C0F000001280B00000A6F0300002B7B090000042A9A02280A00000A727F0100700228160000068C0F000001280B00000A6F0300002B7B070000042A9A02280A00000A727F0100700228160000068C0F000001280B00000A6F0300002B7B0A0000042A8602280A00000A727F0100700228160000068C0F000001280B00000A6F0300002B2A8E02280A00000A7241010070038C07000001280B00000A6F1100000A2C03176A2A166A2A7202280A00000A727F010070038C0F000001280B00000A6F0300002B2A00133003002D00000002000011020328230000060A1200177D0A00000402280A00000A727F010070038C0F000001280B00000A066F0100002B2A00000013300400380000000300001102280800000A6F0900000A02280E000006DB0A02280A0000060602280A000006022808000006DBD902281000000602280E000006DB5CDB2A133003003800000003000011020304FE0316FE0172BF010070281700000A0228040000060435080228040000061002030A2B0C0206282700000606176AD70A060436F02A133003008C00000004000011020328230000060A02067B0A00000416FE0172FB010070281700000A1200177D0A000004067B07000004022808000006DB0B0203282400000602067B0800000407281800000A2602022814000006022808000006281800000A26021202FE1503000002120202281900000A7D0200000412020228140000067D030000041202037D0100000408280400002B2A133003009A000000050000110202281800000616FE0172FF010070281700000A0202280600000A6F1300000A022825000006FE0516FE01724B020070281700000A02022806000006166AFE037283020070281700000A022804000006176AD70A020602280600000A6F0700000A282900000602062817000006021728190000060228060000060B0207176ADB28070000060228060000062D0C0202282500000628090000062A26020304281D0000062A13300300A1000000060000110202280600000A6F1300000A166AFE017295020070281700000A020302280600000A6F0700000A281A00000A7295020070281700000A020205281B00000602280600000A6F0700000A281A00000A7295020070281700000A020304281B00000A7295020070281700000A020405282B0000060203282C000006021200FE15030000021200037D020000041200047D030000041200057D0100000406280400002B2A6A020302032802000006176AD7281A000006020403281D0000062A4A020302032802000006176ADB281A0000062A0042534A4201000100000000000C00000076342E302E33303331390000000005006C00000084060000237E0000F0060000A005000023537472696E677300000000900C0000B402000023555300440F0000100000002347554944000000540F00005801000023426C6F6200000000000000020000015715A201090A000000FA0133001600000100000010000000050000000A0000002C000000200000001B0000000900000006000000010000000C00000017000000010000000200000003000000040000000000EF020100000000000600DE01270406000D0227040600CA0101040F00470400000A00D804BA040A008B01BA040A00AA04BA040600810111030A00FE01BA040A006C01BA040A005802BA040A009F01BA0406004D0211030600E604110306000E0011030A001505BA04000000001500000000000100010001001000890300001500010001000A011000BF030000210001002D000A01100099050000210004002D000A01100055050000210007002D0006003A00BE0006003003C1000600A303C10006003A00BE000600A303C10006001E00C50006003502BE0006006204C10006003A03C8000600B100C8005020000000008618FB0310000100D2200000000086003B02CB000200EF20000000008608370125000300F7200000000086085F052500030009210000000081086F05D10003001C210000000086082A05250004002E210000000081083C05D10004004121000000008608E700250005005321000000008108F400D1000500662100000000860811012500060078210000000081081E01D10006008B210000000086085503250007009D210000000081086F03D1000700B021000000008608C30225000800C221000000008108D902D1000800D521000000008608690225000900E7210000000081087D02D1000900FA21000000008608910225000A000C22000000008108AA02D1000A001F22000000008608C8031B000B003122000000008108DA03D6000B004422000000008608860425000C006B220000000081089C04D1000C0093220000000086085300DC000D00BA220000000081086500E0000D00E2220000000081005901E5000E0000230000000086004502EC0010001D230000000086007700DC0011003423000000008100EC03F2001100CB230000000086004403DC001300F223000000008600CF002500130019240000000086007F00DC00130040240000000081000105F900130062240000000086004E01CB00130086240000000081000105FE001400A4240000000081009800D1001500E02400000000860001012500160024250000000086001404040116006825000000008600DC00D100180000260000000086000B0506001900A6260000000081002505F2001900B02600000000860028030A011B005D270000000081009B03E5001E0078270000000081001803D600200000000100C40100000100F50300000100350200000100350200000100350200000100350200000100350200000100350200000100350200000100350200000100350200000100350200000100350200000100B20400000200640100000100420000000100420000000200B20400000100B20400000100420000000100420000000100C10000000200C900000001004A0000000100420000000200B20400000100350300000200A60300000300420000000100A6030000020042000000010035030900FB0301001100FB0306001900FB030A004900FB0306002900FB0310002900750116005100B4031B0029005F0220005900A90325002900B00129006900D1042E0061000100340029002B01250061000B003900610070043F0061007B044500610001034C0061000903510051002B0225006100F7045F00290054026C006100ED04780029004E0588002900BF039600290056041B0039007F05AD0039008B05AD002100230051012E000B0020012E00130029012E001B004801410023005101610023005101810023005101A10023005101C1002300510157007F0084008E00A300A8000200010000003B0113010000730513010000400513010000F80013010000220113010000730313010000DD0213010000810213010000AE0213010000DE0317010000A0041301000069001C0102000300030002000400050001000500050002000600070001000700070002000800090001000900090002000A000B0001000B000B0002000C000D0001000D000D0002000E000F0001000F000F00020010001100010011001100020012001300010013001300020014001500010015001500020016001700010017001700020018001900010019001900048000000000000000000000000000000000D8040000040000000000000000000000B5002300000000000100020001000000000000000000BA0400000000030002000400020005000200290067002B0073002D0067002B009E00000000000047657455496E7436340053657455496E743634003C4D6F64756C653E00646174610053797374656D2E507269766174652E436F72654C696200546F6B656E496400746F6B656E4964007469636B65744964006765745F41646472657373426964646564007365745F41646472657373426964646564004973456E646564004765745469636B65744F76657262696452657475726E6564005365745469636B65744F76657262696452657475726E6564006F76657262696452657475726E65640066726F6D42696400746F426964004765745469636B6574426964004765744F766572626964006765745F456E645072696365007365745F456E6450726963650047657443757272656E745072696365006765745F4D61785072696365007365745F4D61785072696365006765745F42616C616E6365006765745F476574436F6E747261637442616C616E63650047657442616C616E63650053657442616C616E63650062616C616E636500494D657373616765006765745F4D6573736167650056616C7565547970650049536D617274436F6E74726163745374617465004950657273697374656E745374617465006765745F50657273697374656E7453746174650073746174650044656275676761626C6541747472696275746500436F6D70696C6174696F6E52656C61786174696F6E7341747472696275746500496E6465784174747269627574650052756E74696D65436F6D7061746962696C697479417474726962757465006765745F56616C75650076616C75650042616C616E63654F66004F776E65724F6600537472696E67004C6F670049426C6F636B006765745F426C6F636B006765745F41756374696F6E456E64426C6F636B007365745F41756374696F6E456E64426C6F636B006765745F41756374696F6E4D696E5072696365426C6F636B007365745F41756374696F6E4D696E5072696365426C6F636B006765745F41756374696F6E5374617274426C6F636B007365745F41756374696F6E5374617274426C6F636B00536D617274436F6E74726163742E646C6C00476574426F6F6C00536574426F6F6C0053797374656D0052656D6F7665546F6B656E46726F6D005472616E7366657246726F6D0066726F6D00636865636B6564496E004765745469636B6574436865636B496E006765745F41756374696F6E74426C6F636B4475726174696F6E007365745F41756374696F6E74426C6F636B4475726174696F6E004576656E74447574636841756374696F6E00416464546F6B656E546F00746F006765745F4E756D626572006765745F53656E646572005472616E73666572006765745F436F6E74726163744F776E6572007365745F436F6E74726163744F776E6572005365744F776E6572006F776E6572002E63746F720053797374656D2E446961676E6F737469637300446973747269627574654F766572626964730053797374656D2E52756E74696D652E436F6D70696C6572536572766963657300446562756767696E674D6F646573006765745F41646472657373006269646465724164647265737300476574416464726573730053657441646472657373006765745F5469636B65744964427941646472657373007365745F5469636B65744964427941646472657373006164647265737300537472617469732E536D617274436F6E74726163747300466F726D617400536D617274436F6E7472616374004F626A6563740047657453747275637400536574537472756374004765745469636B6574004275795469636B657400495472616E73666572526573756C74004D696E74006765745F5469636B657473416D6F756E74007365745F5469636B657473416D6F756E7400417373657274005469636B65744E6577006765745F546F74616C537570706C79007365745F546F74616C537570706C79006F705F457175616C697479006F705F496E657175616C6974790042757900000000001354006F00740061006C003A007B0030007D00001754006F00740061006C0053007500700070006C007900001B5400690063006B0065007400730041006D006F0075006E007400001145006E0064005000720069006300650000114D006100780050007200690063006500002B410075006300740069006F006E00740042006C006F0063006B004400750072006100740069006F006E000023410075006300740069006F006E005300740061007200740042006C006F0063006B00001F410075006300740069006F006E0045006E00640042006C006F0063006B000029410075006300740069006F006E004D0069006E005000720069006300650042006C006F0063006B00001B43006F006E00740072006100630074004F0077006E0065007200001D5400690063006B00650074004900640073005B007B0030007D005D00002541006400640072006500730073004200690064006400650064005B007B0030007D005D000017420061006C0061006E00630065003A007B0030007D00001154006F006B0065006E007B0030007D00002D6F006E00650020006D006F007200650020007400690063006B0065007400280074006F006B0065006E002900003B62006900640073002000770069006E0064006F0077002000730068006F0075006C006400200062006500200063006F007200720065006300740000037400004B4F006E006C00790020006F006E00650020007400690063006B006500740020006200790020006100640064007200650073007300200069007300200061006C006C006F00770065006400003762006900640020006C0065007300730020007400680061006E002000630075007200720065006E007400200070007200690063006500001173006F006C00640020006F0075007400001D41007300730065007200740020006600610069006C00650064002E000000CB78156DE7782C40A6F68FEA279D3BBF000420010108032000010520010111110520010112190420001229042000111D042000122D0320000B04200012310500020E0E1C0420010B0E052002010E0B052001111D0E062002010E111D042001020E052002010E0207070311140B111007300102010E1E00040A01111406300101011E00040A011110063001011E000E04070111140307010B05200201020E07070311140B110C0720021241111D0B040A01110C0407020B0B040701110C07000202111D111D087CEC85D7BEA7798E02060B0306111D02060E0206020520010B111D042001010B05200101111D03200002042001010206200201111D0B052001111D0B062002010B111D042000111405200111140B052002010B0B08200301111D111D0B0328000B042800111D032800020801000800000000001E01000100540216577261704E6F6E457863657074696F6E5468726F77730108010002000000000004010000000000000000000000000000000000100000000000000000000000000000007C38000000000000000000009638000000200000000000000000000000000000000000000000000088380000000000000000000000005F436F72446C6C4D61696E006D73636F7265652E646C6C0000000000FF250020001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000C000000A83800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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

    if (this.mode === Mode.IssueToken ) {
      return {
        amount: this.amount.value,
        feeAmount: this.feeAmount.value,
        gasPrice: this.gasPrice.value,
        gasLimit: this.gasLimit.value,
        parameters: [
          `7#${this.totalSupply.value}`,
          `4#${this.tokenName.value}`,
          `4#${this.tokenSymbol.value.toUpperCase()}`
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
    this.tokenName = new FormControl('My token', [Validators.required]);
    this.tokenSymbol = new FormControl('MTK', [Validators.required]);

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
    } else if (this.mode === Mode.IssueToken || this.mode === Mode.IssueEvent ) {
      this.transactionForm = new FormGroup({
        feeAmount: this.feeAmount,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        contractCode: this.contractCode,
        password: this.password,
        totalSupply: this.totalSupply,
        tokenName: this.tokenName,
        tokenSymbol: this.tokenSymbol
      });
    }
  }
}
