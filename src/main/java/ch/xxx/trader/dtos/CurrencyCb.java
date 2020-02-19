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
package ch.xxx.trader.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CurrencyCb {
	private final String currency;
	private final QuoteCb rates;
	
	public CurrencyCb(@JsonProperty("currency")String currency,@JsonProperty("rates") QuoteCb rates) {
		super();
		this.currency = currency;
		this.rates = rates;
	}
	public String getCurrency() {
		return currency;
	}
	public QuoteCb getRates() {
		return rates;
	}
}
