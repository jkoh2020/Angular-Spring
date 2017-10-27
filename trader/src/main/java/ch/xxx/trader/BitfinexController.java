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
package ch.xxx.trader;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.xxx.trader.clients.QuoteBf;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/bitfinex")
public class BitfinexController {
	@Autowired
	private ReactiveMongoOperations operations;	
	
	@GetMapping
	public Flux<QuoteBf> allQuotes() {
		return this.operations.findAll(QuoteBf.class);
	}		
	
	@GetMapping("/btcusd/today")
	public Flux<QuoteBf> todayQuotesBtcUsd() {
		Query query = MongoUtils.buildTodayQuery(Optional.of("btcusd"));
		return this.operations.find(query,QuoteBf.class)
				.filter(q -> filterEvenMinutes(q));
	}
	
	@GetMapping("/ethusd/today")
	public Flux<QuoteBf> todayQuotesEthUsd() {
		Query query = MongoUtils.buildTodayQuery(Optional.of("ethusd"));
		return this.operations.find(query,QuoteBf.class)
				.filter(q -> filterEvenMinutes(q));
	}
	
	@GetMapping("/ltcusd/today")
	public Flux<QuoteBf> todayQuotesLtcUsd() {
		Query query = MongoUtils.buildTodayQuery(Optional.of("ltcusd"));
		return this.operations.find(query,QuoteBf.class)
				.filter(q -> filterEvenMinutes(q));
	}

	@GetMapping("/xrpusd/today")
	public Flux<QuoteBf> todayQuotesXrpUsd() {
		Query query = MongoUtils.buildTodayQuery(Optional.of("xrpusd"));
		return this.operations.find(query,QuoteBf.class)
				.filter(q -> filterEvenMinutes(q));
	}
	
	@GetMapping("/btcusd/current")
	public Mono<QuoteBf> currentQuoteBtcUsd() {
		Query query = MongoUtils.buildCurrentQuery(Optional.of("btcusd"));
		return this.operations.findOne(query,QuoteBf.class);
	}
	
	@GetMapping("/ethusd/current")
	public Mono<QuoteBf> currentQuoteEthUsd() {
		Query query = MongoUtils.buildCurrentQuery(Optional.of("ethusd"));
		return this.operations.findOne(query,QuoteBf.class);
	}
	
	@GetMapping("/ltcusd/current")
	public Mono<QuoteBf> currentQuoteLtcUsd() {
		Query query = MongoUtils.buildCurrentQuery(Optional.of("ltcusd"));
		return this.operations.findOne(query,QuoteBf.class);
	}
	
	@GetMapping("/xrpusd/current")
	public Mono<QuoteBf> currentQuoteXrpUsd() {
		Query query = MongoUtils.buildCurrentQuery(Optional.of("xrpusd"));
		return this.operations.findOne(query,QuoteBf.class);
	}
	
	@GetMapping("/btcusd")
	public Flux<QuoteBf> allQuotesBtcUsd() {
		Query query = new Query();
		query.addCriteria(Criteria.where("pair").is("btcusd"));
		return this.operations.find(query,QuoteBf.class);
	}
		
	@GetMapping("/ethusd")
	public Flux<QuoteBf> allQuotesEthUsd() {
		Query query = new Query();
		query.addCriteria(Criteria.where("pair").is("ethusd"));
		return this.operations.find(query,QuoteBf.class);
	}
	
	@GetMapping("/ltcusd")
	public Flux<QuoteBf> allQuotesLtcUsd() {
		Query query = new Query();
		query.addCriteria(Criteria.where("pair").is("ltcusd"));
		return this.operations.find(query,QuoteBf.class);
	}
	
	@GetMapping("/xrpusd")
	public Flux<QuoteBf> allQuotesXrpUsd() {
		Query query = new Query();
		query.addCriteria(Criteria.where("pair").is("xrpusd"));
		return this.operations.find(query,QuoteBf.class);
	}
	
	private boolean filterEvenMinutes(QuoteBf quote) {
		return MongoUtils.filterEvenMinutes(quote.getCreatedAt());
	}
}
