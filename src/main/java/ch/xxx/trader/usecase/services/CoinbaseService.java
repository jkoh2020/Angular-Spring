/**
 *    Copyright 2016 Sven Loesekann

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
package ch.xxx.trader.usecase.services;

import java.util.Optional;

import org.springframework.data.mongodb.core.ReactiveMongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import ch.xxx.trader.adapter.cron.PrepareData;
import ch.xxx.trader.domain.common.MongoUtils;
import ch.xxx.trader.domain.dtos.QuoteCb;
import ch.xxx.trader.domain.dtos.QuoteCbSmall;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CoinbaseService {
	private final ReactiveMongoOperations operations;
	
	public CoinbaseService(ReactiveMongoOperations operations) {
		this.operations = operations;
	}
	
	public Flux<QuoteCbSmall> todayQuotesBc() {
		Query query = MongoUtils.buildTodayQuery(Optional.empty());
		return this.operations.find(query,QuoteCb.class)
				.filter(q -> filterEvenMinutes(q))
				.map(quote -> new QuoteCbSmall(quote.getCreatedAt(), quote.getUsd(), quote.getEur(), quote.getEth(), quote.getLtc()));
	}
	
	public Flux<QuoteCbSmall> sevenDaysQuotesBc() {
		Query query = MongoUtils.build7DayQuery(Optional.empty());
		return this.operations.find(query,QuoteCb.class,PrepareData.CB_HOUR_COL)
				.filter(q -> filterEvenMinutes(q))
				.map(quote -> new QuoteCbSmall(quote.getCreatedAt(), quote.getUsd(), quote.getEur(), quote.getEth(), quote.getLtc()));
	}
	
	public Flux<QuoteCbSmall> thirtyDaysQuotesBc() {
		Query query = MongoUtils.build30DayQuery(Optional.empty());
		return this.operations.find(query,QuoteCb.class,PrepareData.CB_DAY_COL)
				.filter(q -> filterEvenMinutes(q))
				.map(quote -> new QuoteCbSmall(quote.getCreatedAt(), quote.getUsd(), quote.getEur(), quote.getEth(), quote.getLtc()));
	}
	
	public Flux<QuoteCbSmall> nintyDaysQuotesBc() {
		Query query = MongoUtils.build90DayQuery(Optional.empty());
		return this.operations.find(query,QuoteCb.class,PrepareData.CB_DAY_COL)
				.filter(q -> filterEvenMinutes(q))
				.map(quote -> new QuoteCbSmall(quote.getCreatedAt(), quote.getUsd(), quote.getEur(), quote.getEth(), quote.getLtc()));
	}
	
	public Mono<QuoteCb> currentQuoteBc() {
		Query query = MongoUtils.buildCurrentQuery(Optional.empty());
		return this.operations.findOne(query,QuoteCb.class);
	}
	
	private boolean filterEvenMinutes(QuoteCb quote) {
		return MongoUtils.filterEvenMinutes(quote.getCreatedAt());
	}
}
