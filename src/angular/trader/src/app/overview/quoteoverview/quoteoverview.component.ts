/* Copyright 2016 Sven Loesekann

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BitstampService } from '../../services/bitstamp.service';
import { CoinbaseService } from '../../services/coinbase.service';
import { ItbitService } from '../../services/itbit.service';
import { BitfinexService } from '../../services/bitfinex.service';
import { QuoteBs } from '../../common/quote-bs';
import { QuoteCb } from '../../common/quote-cb';
import { QuoteIb } from '../../common/quote-ib';
import { QuoteBf } from '../../common/quote-bf';
import { Observable, Subject } from 'rxjs';
import {DataSource, CollectionViewer} from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { CommonUtils } from '../../common/common-utils';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { MyuserService } from '../../services/myuser.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-quoteoverview',
  templateUrl: './quoteoverview.component.html',
  styleUrls: ['./quoteoverview.component.scss']
})
export class QuoteoverviewComponent implements OnInit,OnDestroy {

    datasource = new Myds();
    hash: string = null;
    private interval: any;
    private utils = new CommonUtils();

    constructor(private router: Router,
            private serviceBs: BitstampService,
            private serviceCb: CoinbaseService,
            private serviceIb: ItbitService,
            private serviceBf: BitfinexService,
            private serviceMu: MyuserService,
            public dialog: MatDialog) {
    }

    ngOnInit() {
      this.refreshData();
      if(this.interval){
          clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
          this.refreshData();
      }, 15000);
      for(let i = 0;i<16;i++) {
          this.datasource.rows.push(new Myrow('','',0,0, null,-1,-1));
      }
      this.hash = this.serviceMu.salt;
      //console.log(this.hash);
    }

    ngOnDestroy(): void {
      if(this.interval){
          clearInterval(this.interval);
      }
    }

    openLoginDialog(): void {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '500px',
        data: { hash: this.hash}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.hash = typeof result === 'undefined' || result === null ? null : result;
      });
    }

    logout(): void {
        this.serviceMu.postLogout(this.hash).subscribe(myUser => this.hash = myUser.salt);
    }

    orderbooks(): void {
      this.router.navigateByUrl('orderbooks');
    }

    selectedRow(row: Myrow): void {
      //console.log(row);
      if(row.exchange === 'Bitstamp') {
          this.router.navigateByUrl('details/bsdetail/' + row.pair);
      } else if(row.exchange === 'Itbit' && row.pair === 'XBTUSD') {
          this.router.navigateByUrl('details/ibdetail/' + this.serviceIb.BTCUSD);
      } else if(row.exchange === 'Coinbase') {
          this.router.navigateByUrl('details/cbdetail/' + row.pair);
      } else if(row.exchange === 'Bitfinex') {
          this.router.navigateByUrl('details/bfdetail/' + row.pair);
      }
    }

    createRowBs(quote: QuoteBs, exchange: string, currpair: string): Myrow {
        return !quote ? new Myrow(exchange, currpair) : new Myrow(exchange, currpair, this.formatNumber(quote?.last),
			this.formatNumber(quote?.volume), quote?.pair, this.formatNumber(quote?.high), this.formatNumber(quote?.low));
    }

    createRowBf(quote: QuoteBf, exchange: string, currpair: string): Myrow {
        return !quote ? new Myrow(exchange, currpair) : new Myrow(exchange, currpair, this.formatNumber(quote?.last_price)
			, this.formatNumber(quote?.volume),	quote?.pair, this.formatNumber(quote?.high), this.formatNumber(quote?.low));
    }

    createRowCb(quote: QuoteCb): Myrow[] {
        const rows: Myrow[] = [];
        rows.push(new Myrow('Coinbase', this.utils.getCurrpairName(this.serviceCb.BTCUSD),
			!quote ? 0 : this.formatNumber(quote.usd), -1, this.serviceCb.BTCUSD, -1, -1));
        rows.push(new Myrow('Coinbase', this.utils.getCurrpairName(this.serviceCb.ETHUSD),
			!quote ? 0 : this.formatNumber(quote.usd / quote.eth), -1, this.serviceCb.ETHUSD, -1, -1));
        rows.push(new Myrow('Coinbase', this.utils.getCurrpairName(this.serviceCb.LTCUSD),
			!quote ? 0 : this.formatNumber(quote.usd / quote.ltc), -1, this.serviceCb.LTCUSD, -1, -1));
        return rows;
    }

    createRowIb(quote: QuoteIb, exchange: string, currpair: string): Myrow {
       return !quote ? new Myrow(exchange, currpair) : new Myrow(exchange, currpair, this.formatNumber(quote?.lastPrice),
			this.formatNumber(quote?.volume24h), quote?.pair, this.formatNumber(quote?.high24h), this.formatNumber(quote?.low24h));
    }

    private refreshData() {
        this.serviceBs.getCurrentQuote(this.serviceBs.BTCEUR).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[0] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.BTCEUR));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.ETHEUR).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[1] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.ETHEUR));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.LTCEUR).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[2] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.LTCEUR));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.XRPEUR).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[3] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.XRPEUR));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.BTCUSD).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[4] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.BTCUSD));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.ETHUSD).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[5] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.ETHUSD));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.LTCUSD).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[6] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.LTCUSD));
            this.datasource.updateRows();});
        this.serviceBs.getCurrentQuote(this.serviceBs.XRPUSD).pipe(filter(result => (!!result?.last))).subscribe(quote => {
            this.datasource.rows[7] = this.createRowBs(quote, 'Bitstamp', this.utils.getCurrpairName(this.serviceBs.XRPUSD));
            this.datasource.updateRows();});
        this.serviceIb.getCurrentQuote(this.serviceIb.BTCUSD).pipe(filter(result => (!!result?.lastPrice))).subscribe(quote => {
            this.datasource.rows[8] = this.createRowIb(quote, 'Itbit', this.utils.getCurrpairName(this.serviceIb.BTCUSD));
            this.datasource.updateRows();});
        this.serviceCb.getCurrentQuote().pipe(filter(result => (!!result?.btc))).subscribe(quote => {
            const myrows = this.createRowCb(quote);
            this.datasource.rows[9] = myrows[0];
            this.datasource.rows[10] = myrows[1];
            this.datasource.rows[11] = myrows[2];
            this.datasource.updateRows();});
        this.serviceBf.getCurrentQuote(this.serviceBf.BTCUSD).pipe(filter(result => (!!result?.last_price))).subscribe(quote => {
            this.datasource.rows[12] = this.createRowBf(quote, 'Bitfinex', this.utils.getCurrpairName(this.serviceBf.BTCUSD));
            this.datasource.updateRows();});
        this.serviceBf.getCurrentQuote(this.serviceBf.ETHUSD).pipe(filter(result => (!!result?.last_price))).subscribe(quote => {
            this.datasource.rows[13] = this.createRowBf(quote, 'Bitfinex', this.utils.getCurrpairName(this.serviceBf.ETHUSD));
            this.datasource.updateRows();});
        this.serviceBf.getCurrentQuote(this.serviceBf.LTCUSD).pipe(filter(result => (!!result?.last_price))).subscribe(quote => {
            this.datasource.rows[14] = this.createRowBf(quote, 'Bitfinex', this.utils.getCurrpairName(this.serviceBf.LTCUSD));
            this.datasource.updateRows();});
        this.serviceBf.getCurrentQuote(this.serviceBf.XRPUSD).pipe(filter(result => (!!result?.last_price))).subscribe(quote => {
            this.datasource.rows[15] = this.createRowBf(quote, 'Bitfinex', this.utils.getCurrpairName(this.serviceBf.XRPUSD));
            this.datasource.updateRows();});
    }

    private formatNumber(x: number): number {
        return isNaN(x) ? 0 : Math.round(x*100)/100;
    }
}

export class Myds extends DataSource<Myrow> {
    rows: Myrow[] = [];
    private subject: Subject<Myrow[]> = new Subject();

    updateRows(): void {
        this.subject.next(this.rows);
    }

    connect(collectionViewer: CollectionViewer): Observable<Myrow[]> {
        return this.subject;
    }
    disconnect(collectionViewer: CollectionViewer): void {
    }
}

export class Myrow {
    constructor(public exchange: string = '', public currpair: string = '', public last: number = 0,
		public volume: number = 0, public pair: string = '', public high: number = 0, public low: number = 0) {}
}
